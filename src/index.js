import template from 'babel-template';
import generate from 'babel-generator';
import * as t from 'babel-types';

const buildRequire = template(`
  $q(FUNCTION);
`);

function generateAst (node) {
  const args = node[0];
  let func;

  if (t.isArrowFunctionExpression(args)) {
    func = t.arrowFunctionExpression(args.params, args.body, false);
  } else if (t.isFunctionExpression(args)) {
    func = t.functionExpression(args.id, args.params, args.body, args.generator, args.async);
  }

  return buildRequire({
    FUNCTION: func
  });
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
            newExpression = first.expression;
            if (newExpression.callee && newExpression.callee.type === 'Identifier' && newExpression.callee.name === 'Promise') {
              promiseIdentifier = newExpression.callee;
              args = newExpression.arguments;
              const newNode = generateAst(args);
              path.replaceWith(newNode);
            }
          }
        }
      }
    }
  };
}
