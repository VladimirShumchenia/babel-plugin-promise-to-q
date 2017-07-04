'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      ExpressionStatement: function ExpressionStatement(path) {
        var first = path.node;
        var newExpression = void 0;
        var args = void 0;

        if (t.isNewExpression(first.expression)) {
          processNewExpression();
        } else if (t.isCallExpression(first.expression)) {
          processCallExpression();
        }

        function processNewExpression() {
          newExpression = first.expression;
          if (t.isIdentifier(newExpression.callee, { name: 'Promise' })) {
            args = newExpression.arguments;
            var newNode = generateAst(args);
            path.replaceWith(newNode);
          }
        }

        function processCallExpression() {
          var callArgs = first.expression.arguments;
          if (callArgs && callArgs.length) {
            for (var item in callArgs) {
              newExpression = null;

              if (t.isNewExpression(callArgs[item])) {
                newExpression = callArgs[item];
              }

              if (newExpression && t.isIdentifier(newExpression.callee, { name: 'Promise' })) {
                args = newExpression.arguments;
                var id = path.scope.generateUidIdentifier('qPromise');
                var newNode = generateAst(args, id);
                path.insertBefore(newNode);
                callArgs[item] = id;
              }
            }
          }
        }
      },
      VariableDeclaration: function VariableDeclaration(path) {
        var first = path.node;
        var declarations = void 0;
        var promiseDeclaration = void 0;
        var promiseFunction = void 0;
        if (first && first.declarations && first.declarations.length) {
          declarations = first.declarations;
          for (var item in declarations) {
            var declaration = declarations[item];
            if (declaration.init && t.isNewExpression(declaration.init)) {
              if (declaration.init.callee && declaration.init.callee.type === 'Identifier' && declaration.init.callee.name === 'Promise') {
                promiseDeclaration = declaration.init;
                if (promiseDeclaration.arguments) {
                  var newNode = generateAst(promiseDeclaration.arguments, declarations[item].id, first.kind);
                  path.replaceWith(newNode);
                }
              }
            }
          }
        }
      },
      ObjectExpression: function ObjectExpression(path) {
        var properties = path.node.properties;
        for (var item in properties) {
          if (t.isNewExpression(properties[item].value) && t.isIdentifier(properties[item].value.callee, { name: 'Promise' })) {
            var callee = properties[item].value.callee;
            var args = properties[item].value.arguments;
            var newNode = generateObjectMethod(callee, args);
            properties[item].value = newNode;
          }
        }
      }
    }
  };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelGenerator = require('babel-generator');

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qTemplate = (0, _babelTemplate2.default)('\n  $q(FUNCTION);\n');

var qTemplateMemberExpression = (0, _babelTemplate2.default)('\n  OBJNAME.PROPNAME = $q(FUNCTION);\n');

var qTemplateVariable = {
  'var': (0, _babelTemplate2.default)('\n    var ID = $q(FUNCTION);\n  '),
  'let': (0, _babelTemplate2.default)('\n    let ID = $q(FUNCTION);\n  '),
  'const': (0, _babelTemplate2.default)('\n    const ID = $q(FUNCTION);\n  '),
  'objectExpression': (0, _babelTemplate2.default)('\n    NAME: $q(FUNCTION)\n  ')
};

function generateAst(node, identifier) {
  var kind = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'var';
  var objName = arguments[3];
  var propName = arguments[4];

  var args = Array.isArray(node) ? node[0] : node;
  var func = void 0;

  if (t.isArrowFunctionExpression(args)) {
    func = t.arrowFunctionExpression(args.params, args.body, false);
  } else if (t.isFunctionExpression(args)) {
    func = t.functionExpression(args.id, args.params, args.body, args.generator, args.async);
  }

  if (func && objName && propName) {
    return qTemplateMemberExpression({
      FUNCTION: func,
      OBJNAME: t.identifier(objName),
      PROPNAME: t.identifier(propName)
    });
  } else if (func && objName) {
    console.log(objName);
    return qTemplateVariable.objectExpression({
      FUNCTION: func,
      NAME: t.identifier(objName)
    });
  } else if (func && identifier) {
    return qTemplateVariable[kind]({
      FUNCTION: func,
      ID: identifier
    });
  } else if (func) {
    return qTemplate({
      FUNCTION: func
    });
  } else {
    return args;
  }
}

function generateObjectMethod(callee, args) {
  var func = t.callExpression(callee, args);
  func.callee.name = '$q';
  return func;
}