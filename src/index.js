import template from 'babel-template';
import generate from 'babel-generator';
import * as t from 'babel-types';

const qTemplate = template(`
  $q(FUNCTION);
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
  `)
};

function generateAst (node, identifier, kind = 'var') {
  const args = node[0];
  let func;

  if (t.isArrowFunctionExpression(args)) {
    func = t.arrowFunctionExpression(args.params, args.body, false);
  } else if (t.isFunctionExpression(args)) {
    func = t.functionExpression(args.id, args.params, args.body, args.generator, args.async);
  }

  if (func && identifier) {
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

              if (newExpression && t.isIdentifier(newExpression.callee) && newExpression.callee.name === 'Promise') {
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
      }
    }
  };
}
