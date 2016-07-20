import template from 'babel-template';
import generate from 'babel-generator';
import * as t from 'babel-types';

const qTemplate = template(`
  $q(FUNCTION);
`);

const qTemplateAsFunctionArgument = template(`
  var ID = $q(FUNCTION);
`);

function generateAst (node, identifier) {
  const args = node[0];
  let func;

  if (t.isArrowFunctionExpression(args)) {
    func = t.arrowFunctionExpression(args.params, args.body, false);
  } else if (t.isFunctionExpression(args)) {
    func = t.functionExpression(args.id, args.params, args.body, args.generator, args.async);
  }

  if (identifier) {
    return qTemplateAsFunctionArgument({
      FUNCTION: func,
      ID: identifier
    });
  } else {
    return qTemplate({
      FUNCTION: func
    });
  }
}

export default function ({ types: t }) {
  return {
    visitor: {
      ExpressionStatement (path) {
        const first = path.node;
        let newExpression;
        let promiseIdentifier;
        let args;
        if (first.type === 'ExpressionStatement') {
          if (first.expression.type === 'NewExpression') {
            processNewExpression();
          } else if (first.expression.type === 'CallExpression') {
            processCallExpression();
          }
        }

        function processNewExpression () {
          newExpression = first.expression;
          if (newExpression.callee && newExpression.callee.type === 'Identifier' && newExpression.callee.name === 'Promise') {
            promiseIdentifier = newExpression.callee;
            args = newExpression.arguments;
            const newNode = generateAst(args);
            path.replaceWith(newNode);
          }
        }

        function processCallExpression () {
          let callArgs = first.expression.arguments;
          if (callArgs && callArgs.length) {
            for (const item in callArgs) {
              if (callArgs[item] && callArgs[item].type === 'NewExpression') {
                newExpression = callArgs[item];
                if (newExpression.callee && newExpression.callee.type === 'Identifier' && newExpression.callee.name === 'Promise') {
                  promiseIdentifier = newExpression.callee;
                  args = newExpression.arguments;
                  const id = path.scope.generateUidIdentifier('qPromise');
                  const newNode = generateAst(args, id);
                  path.insertBefore(newNode);
                  callArgs[item] = id;
                }
              }
            }
          }
        }
      }
    }
  };
}
