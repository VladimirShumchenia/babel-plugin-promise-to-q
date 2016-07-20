module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
   "sourceType": "module"
 },
  'rules': {
    'no-unexpected-multiline': 2,
    'wrap-iife': [2, 'inside'],
    'block-spacing': 2,
    // Enforce 1 true brace style (brace on same line, end on new line)
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
    // Enforce camelCase naming
    'camelcase': [2, { 'properties': 'always' }],
    // Enforce spacing after commas and never before
    'comma-spacing': [2, { 'before': false, 'after': true }],
    'comma-style': [2, 'last'],
    'comma-dangle': 2,
    // Always require curlies to denote blocks
    'curly': [2, 'all'],
    // Enforce a newline at the end of files
    'eol-last': 2,
    // Enforce 2 space, space indentation
    'indent': [2, 2],
    'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }],
    // Remove all Line ending rules
    'linebreak-style': [0],
    // Require a capital letter to distinguish constructors
    'new-cap': 2,
    'no-trailing-spaces': 2,
    'object-curly-spacing': [2, 'always'],
    // Enforce single quotes
    'quotes': [2, 'single'],
    'quote-props': 0,
    'semi-spacing': [2, { 'before': false, 'after': true }],
    // Always require semicolons
    'semi': [2, 'always'],
    // Enforce spacing between most keywords and symbols
    'keyword-spacing': [2, 'always'],
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [0],
    'space-infix-ops': [2, { 'int32Hint': false }],
    'keyword-spacing': 2,
    'space-unary-ops': [2, { 'words': true, 'nonwords': false }],
    'spaced-comment': [2, 'always'],
    'max-len': 0,
    'arrow-spacing': [2, { 'before': true, 'after': true }],
  },
  'env': {
    'es6': true,
    'browser': true,
  },
  // Some common globals in browser environments
  'globals': {
    '$': false,
    '$q': false,
  },
};
