'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  root: true,

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      "jsx": true
    }
  },

  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true
  },

  extends: [
    // "plugin:react/recommended",
    'plugin:you-dont-need-lodash-underscore/compatible',
    "prettier",
    "prettier/react",
  ],

  plugins: ['jest', 'react', 'prettier', 'you-dont-need-lodash-underscore'],

  globals: {
    module: OFF,
    document: true,
    suite: true,
    escape: false,
    navigator: false,
    unescape: true,
    window: true
  },
  rules: {
    'no-var': ERROR,
    'prefer-const': ERROR,
    // React
    'react/display-name': OFF,
    'react/jsx-boolean-value': WARNING,
    'react/jsx-max-props-per-line': OFF,
    'react/jsx-indent-props': OFF,
    'react/jsx-no-duplicate-props': WARNING,
    'react/jsx-no-undef': WARNING,
    'react/jsx-quotes': OFF,
    'react/jsx-sort-prop-types': OFF,
    'react/jsx-sort-props': OFF,
    'react/jsx-uses-react': WARNING,
    'react/jsx-uses-vars': WARNING, //Prevent variables used in JSX to be incorrectly marked as unused
    'react/no-danger': OFF,
    'react/no-set-state': OFF,
    'react/no-did-mount-set-state': WARNING,
    'react/no-did-update-set-state': WARNING,
    'react/no-multi-comp': WARNING,
    'react/no-unknown-property': WARNING,
    'react/prop-types': WARNING,
    'react/react-in-jsx-scope': WARNING,
    'react/self-closing-comp': WARNING,
    'react/sort-comp': WARNING,
    'no-cond-assign': WARNING, // disallow assignment in conditional expressions
    'no-console': OFF, // disallow use of console (off by default in the node environment)
    'no-constant-condition': WARNING, // disallow use of constant expressions in conditions
    'no-comma-dangle': OFF, // disallow trailing commas in object literals
    'no-control-regex': WARNING, // disallow control characters in regular expressions
    'no-debugger': WARNING, // disallow use of debugger
    'no-dupe-keys': WARNING, // disallow duplicate keys when creating object literals
    'no-empty': OFF, // disallow empty statements
    'no-empty-character-class': WARNING, // disallow the use of empty character classes in regular expressions
    'no-ex-assign': WARNING, // disallow assigning to the exception in a catch block
    'no-extra-boolean-cast': WARNING, // disallow double-negation boolean casts in a boolean context
    'no-extra-parens': OFF, // disallow unnecessary parentheses (off by default)
    'no-func-assign': WARNING, // disallow overwriting functions written as function declarations
    'no-inner-declarations': OFF, // disallow function or variable declarations in nested blocks
    'no-invalid-regexp': WARNING, // disallow invalid regular expression strings in the RegExp constructor
    'no-negated-in-lhs': WARNING, // disallow negation of the left operand of an in expression
    'no-obj-calls': WARNING, // disallow the use of object properties of the global object (Math and JSON) as functions
    'no-regex-spaces': WARNING, // disallow multiple spaces in a regular expression literal
    'no-reserved-keys': OFF, // disallow reserved words being used as object literal keys (off by default)
    'no-sparse-arrays': WARNING, // disallow sparse arrays
    'no-unreachable': WARNING, // disallow unreachable statements after a return, throw, continue, or break statement
    'use-isnan': WARNING, // disallow comparisons with the value NaN
    'valid-jsdoc': OFF, // Ensure JSDoc comments are valid (off by default)
    'valid-typeof': WARNING, // Ensure that the results of typeof are compared against a valid string
    // Jest
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    // "jest/no-identical-title": "error",
    'jest/valid-expect': 'error',

    'prettier/prettier': [
      2,
      {
        singleQuote: true
      }
    ],

    // Best Practices
    // These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.
    'import/extensions': OFF,
    'block-scoped-var': OFF, // treat var statements as if they were block scoped (off by default)
    complexity: OFF, // specify the maximum cyclomatic complexity allowed in a program (off by default)
    'consistent-return': OFF, // require return statements to either always or never specify values
    curly: WARNING, // specify curly brace conventions for all control statements
    'default-case': OFF, // require default case in switch statements (off by default)
    'dot-notation': WARNING, // encourages use of dot notation whenever possible
    eqeqeq: WARNING, // require the use of === and !==
    'guard-for-in': OFF, // make sure for-in loops have an if statement (off by default)
    'no-alert': WARNING, // disallow the use of alert, confirm, and prompt
    'no-caller': WARNING, // disallow use of arguments.caller or arguments.callee
    'no-div-regex': WARNING, // disallow division operators explicitly at beginning of regular expression (off by default)
    'no-else-return': OFF, // disallow else after a return in an if (off by default)
    'no-eq-null': OFF, // disallow comparisons to null without a type-checking operator (off by default)
    'no-eval': WARNING, // disallow use of eval()
    'no-extend-native': WARNING, // disallow adding to native types
    'no-extra-bind': WARNING, // disallow unnecessary function binding
    'no-fallthrough': WARNING, // disallow fallthrough of case statements
    'no-floating-decimal': WARNING, // disallow the use of leading or trailing decimal points in numeric literals (off by default)
    'no-implied-eval': WARNING, // disallow use of eval()-like methods
    'no-labels': OFF, // disallow use of labeled statements
    'no-iterator': WARNING, // disallow usage of __iterator__ property
    'no-lone-blocks': WARNING, // disallow unnecessary nested blocks
    'no-loop-func': OFF, // disallow creation of functions within loops
    'no-multi-str': OFF, // disallow use of multiline strings
    'no-native-reassign': OFF, // disallow reassignments of native objects
    'no-new': WARNING, // disallow use of new operator when not part of the assignment or comparison
    'no-new-func': WARNING, // disallow use of new operator for Function object
    'no-new-wrappers': WARNING, // disallows creating new instances of String,Number, and Boolean
    'no-octal': WARNING, // disallow use of octal literals
    'no-octal-escape': WARNING, // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \ERROR5WARNING";
    'no-proto': WARNING, // disallow usage of __proto__ property
    'no-redeclare': OFF, // disallow declaring the same variable more then once
    'no-return-assign': WARNING, // disallow use of assignment in return statement
    'no-script-url': WARNING, // disallow use of javascript: urls.
    'no-self-compare': WARNING, // disallow comparisons where both sides are exactly the same (off by default)
    'no-sequences': WARNING, // disallow use of comma operator
    'no-unused-expressions': OFF, // disallow usage of expressions in statement position
    'no-void': WARNING, // disallow use of void operator (off by default)
    'no-warning-comments': OFF, // disallow usage of configurable warning terms in comments": WARNING,                        // e.g. TODO or FIXME (off by default)
    'no-with': WARNING, // disallow use of the with statement
    radix: WARNING, // require use of the second argument for parseInt() (off by default)
    'vars-on-top': OFF, // requires to declare all vars on top of their containing scope (off by default)
    'wrap-iife': OFF, // require immediate function invocation to be wrapped in parentheses (off by default)
    yoda: WARNING, // require or disallow Yoda conditions
    // Strict Mode
    // These rules relate to using strict mode.
    strict: OFF, // require that all functions are run in strict mode
    // Variables
    // These rules have to do with variable declarations.
    'no-catch-shadow': WARNING, // disallow the catch clause parameter name being the same as a variable in the outer scope (off by default in the node environment)
    'no-delete-var': WARNING, // disallow deletion of variables
    'no-label-var': WARNING, // disallow labels that share a name with a variable
    'no-shadow': WARNING, // disallow declaration of variables already declared in the outer scope
    'no-shadow-restricted-names': WARNING, // disallow shadowing of names such as arguments
    'no-undef': ERROR, // disallow use of undeclared variables unless mentioned in a /*global */ block
    'no-undefined': OFF, // disallow use of undefined variable (off by default)
    'no-undef-init': WARNING, // disallow use of undefined when initializing variables
    'no-unused-vars': [
      WARNING,
      {
        vars: 'all',
        args: 'none'
      }
    ], // disallow declaration of variables that are not used in the code
    'no-use-before-define': OFF, // disallow use of variables before they are defined
    // Node.js
    // These rules are specific to JavaScript running on Node.js.
    'handle-callback-err': WARNING, // enforces error handling in callbacks (off by default) (on by default in the node environment)
    'no-mixed-requires': WARNING, // disallow mixing regular variable and require declarations (off by default) (on by default in the node environment)
    'no-new-require': WARNING, // disallow use of new operator with the require function (off by default) (on by default in the node environment)
    'no-path-concat': WARNING, // disallow string concatenation with __dirname and __filename (off by default) (on by default in the node environment)
    'no-process-exit': OFF, // disallow process.exit() (on by default in the node environment)
    'no-restricted-modules': WARNING, // restrict usage of specified node modules (off by default)
    'no-sync': OFF, // disallow use of synchronous methods (off by default)
    // Stylistic Issues
    // These rules are purely matters of style and are quite subjective.
    'key-spacing': OFF,
    'comma-spacing': OFF,
    'no-multi-spaces': OFF,
    'brace-style': OFF, // enforce one true brace style (off by default)
    camelcase: WARNING, // require camel case names
    'consistent-this': [WARNING, 'self'], // enforces consistent naming when capturing the current execution context (off by default)
    'func-names': OFF, // require function expressions to have a name (off by default)
    'func-style': OFF, // enforces use of function declarations or expressions (off by default)
    'new-cap': OFF, // require a capital letter for constructors
    'no-nested-ternary': OFF, // disallow nested ternary expressions (off by default)
    'no-array-constructor': WARNING, // disallow use of the Array constructor
    'no-lonely-if': OFF, // disallow if as the only statement in an else block (off by default)
    'no-new-object': WARNING, // disallow use of the Object constructor
    'no-ternary': OFF, // disallow the use of ternary operators (off by default)
    'no-underscore-dangle': OFF, // disallow dangling underscores in identifiers
    'quote-props': OFF, // require quotes around object literal property names (off by default)
    'sort-vars': OFF, // sort variables within the same declaration block (off by default)
    'space-in-brackets': OFF, // require or disallow spaces inside brackets (off by default)
    'space-in-parens': OFF, // require or disallow spaces inside parentheses (off by default)
    'max-nested-callbacks': OFF, // specify the maximum depth callbacks can be nested (off by default)
    'one-var': OFF, // allow just one var statement per function (off by default)
    'wrap-regex': OFF, // require regex literals to be wrapped in parentheses (off by default)
    // Legacy
    // The following rules are included for compatibility with JSHint and JSLint. While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.
    'max-depth': OFF, // specify the maximum depth that blocks can be nested (off by default)
    'max-len': OFF, // specify the maximum length of a line in your program (off by default)
    'max-params': OFF, // limits the number of parameters that can be used in the function declaration. (off by default)
    'max-statements': OFF, // specify the maximum number of statement allowed in a function (off by default)
    'no-bitwise': WARNING, // disallow use of bitwise operators (off by default)
    'no-plusplus': OFF // disallow use of unary operators, ++ and -- (off by default)
  }
};
