import template from 'babel-template';
import generate from 'babel-generator';
import * as t from 'babel-types';

const qTemplate = template(`
  $q(FUNCTION);
`);

const qTemplateMemberExpression = template(`
  OBJNAME.PROPNAME = $q(FUNCTION);
`);

const qTemplateVariable = {
  'var': template(`
    var ID = $q(FUNCTION);
  `),
  'let': template(`
    let ID = $q(FUNCTION);
  `),
  'const': template(`
    const ID = $q(FUNCTION);
  `),
  'objectExpression': template(`
    NAME: $q(FUNCTION)
  `)
};

function generateAst (node, identifier, kind = 'var', objName, propName) {
  const args = Array.isArray(node) ? node[0] : node;
  let func;

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

function generateObjectMethod (callee, args) {
  const func = t.callExpression(callee, args);
  func.callee.name = '$q';
  return func;
}

export default function ({ types: t }) {
  return {
    visitor: {
      ExpressionStatement (path) {
        const first = path.node;
        let newExpression;
        let args;

        if (t.isNewExpression(first.expression)) {
          processNewExpression();
        } else if (t.isCallExpression(first.expression)) {
          processCallExpression();
        }

        function processNewExpression () {
          newExpression = first.expression;
          if (t.isIdentifier(newExpression.callee, { name: 'Promise' })) {
            args = newExpression.arguments;
            const newNode = generateAst(args);
            path.replaceWith(newNode);
          }
        }

        function processCallExpression () {
          let callArgs = first.expression.arguments;
          if (callArgs && callArgs.length) {
            for (const item in callArgs) {
              newExpression = null;

              if (t.isNewExpression(callArgs[item])) {
                newExpression = callArgs[item];
              }

              if (newExpression && t.isIdentifier(newExpression.callee, { name: 'Promise' })) {
                args = newExpression.arguments;
                const id = path.scope.generateUidIdentifier('qPromise');
                const newNode = generateAst(args, id);
                path.insertBefore(newNode);
                callArgs[item] = id;
              }
            }
          }
        }
      },

      VariableDeclaration (path) {
        const first = path.node;
        let declarations;
        let promiseDeclaration;
        let promiseFunction;
        if (first && first.declarations && first.declarations.length) {
          declarations = first.declarations;
          for (let item in declarations) {
            const declaration = declarations[item];
            if (declaration.init && t.isNewExpression(declaration.init)) {
              if (declaration.init.callee && declaration.init.callee.type === 'Identifier' && declaration.init.callee.name === 'Promise') {
                promiseDeclaration = declaration.init;
                if (promiseDeclaration.arguments) {
                  const newNode = generateAst(promiseDeclaration.arguments, declarations[item].id, first.kind);
                  path.replaceWith(newNode);
                }
              }
            }
          }
        }
      },

      AssignmentExpression (path) {
        if (path && path.node && path.node.right && t.isNewExpression(path.node.right)) {
          const args = path.node.right.arguments;
          try {
              const objName = path.node.left.object.name;
              const propName = path.node.left.property.name;
              for (var item in args) {
                  const argItem = args[item];
                  if (t.isFunctionExpression(argItem)) {
                      const newNode = generateAst(argItem, false, false, objName, propName);
                      path.replaceWith(newNode);
                  }
              }
          } catch (e){
            console.log(path.node.left);
          }
        }
      },

      ObjectExpression (path) {
        const properties = path.node.properties;
        for (let item in properties) {
          if (t.isNewExpression(properties[item].value) && t.isIdentifier(properties[item].value.callee, { name: 'Promise' })) {
            const callee = properties[item].value.callee;
            const args = properties[item].value.arguments;
            const newNode = generateObjectMethod(callee, args);
            properties[item].value = newNode;
          }
        }
      }
    }
  };
}
