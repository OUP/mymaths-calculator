//Map elements in an array to a TeX string, which is rendered as maths by KaTeX

import katex from 'katex';
const Fraction = require('fraction.js');
import Decimal from 'decimal.js/decimal';
import buttonType from './ButtonType';
import {
  assembleNumbers,
  assembleArguments,
  convertFracToDecimal
} from './Utilities';
import '../UI/Maths.css';
import { identicalArrays } from './Utilities';

export function parseToRender(
  arr,
  id,
  cursorPosition = -1,
  displayMode = 'default'
) {
  const maths = parseToTeX(arr, cursorPosition, displayMode);
  katex.render(maths, document.getElementById(id));
}

function parseToTeX(arr, cursorPosition = -1, displayMode = 'default') {
  if (arr.length > 1) {
    if (cursorPosition >= 0) {
      arr = addCursor(arr, cursorPosition);
    }
    arr = assembleNumbers(arr);
    arr = assembleArguments(arr);
  }

  return arr
    .map(parseElToTeX, displayMode)
    .join('')
    .toString();
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '|');
  arr.splice(position, 0, '|');
  return arr;
}

function parseElToTeX(el) {
  const bType = buttonType(el);
  switch (bType) {
    case 'number':
      return parseNumber(el, this); //this is the displayMode

    case 'operator':
      return parseOperator(el);

    case 'symbol':
    case 'sqrt':
      return parseSymbol(el, this); //this is the displayMode

    case 'Ans':
      return '\\text {' + el + '}';

    case 'function':
      return parseFunc(el);

    case 'cArg':
    case 'oArg':
      return ''; //hidden characters

    case '|':
      return '{\\text{|}}'; //cursor

    default:
      console.error('unexpected character', el);
      return '';
  }
}

function boxIfArgEmpty(dispArg) {
  if (!dispArg.length) {
    dispArg = ['box'];
  } else if (dispArg.length === 1 && dispArg[0] === '|') {
    dispArg.push('box');
  }
  return dispArg;
}

function genRecurringDecimal(decimal) {
  const decArray = decimal.split('');
  for (let i = 0; i < decArray.length; i++) {
    if (decArray[i] === '(') {
      decArray.splice(i, 2, '\\dot{' + decArray[i + 1] + '}');
    } else if (decArray[i] === ')') {
      if (decArray[i - 1].includes('\\dot')) {
        decArray.pop();
      } else {
        decArray.splice(i - 1, 2, '\\dot{' + decArray[i - 1] + '}');
      }
    }
  }
  return decArray.join('');
}

function parseNumber(num, displayMode) {
  switch (displayMode) {
    case 'fraction':
      return parseNumFractionMode(num);

    case 'decimal':
      return parseNumDecimalMode(num);

    default:
    case 'default':
      return parseNumInputMode(num);
  }
}

function parseNumInputMode(num) {
  if (!num.includes('/')) {
    return num.toString();
  } else {
    num = new Fraction(num);
    return '\\large \\frac {' + num.n + '} {' + num.d + '}';
  }
}

function parseNumFractionMode(num) {
  if (!num.includes('/') && !num.includes('(')) {
    num = new Decimal(num);
    const testFracEl = num.toFraction(1000);
    const fracEl = num.toFraction();
    if (fracEl[1].toString() !== '1' && identicalArrays(fracEl, testFracEl)) {
      return '\\large \\frac {' + fracEl[0] + '} {' + fracEl[1] + '}';
    } else {
      return num;
    }
  } else {
    num = new Fraction(num);
    return '\\large \\frac {' + num.n + '} {' + num.d + '}';
  }
}

function parseNumDecimalMode(num) {
  if (!num.includes('/')) {
    return num.toString();
  } else {
    num = new Fraction(num);
    num = num.toString();
    return genRecurringDecimal(num);
  }
}

function parseOperator(op) {
  switch (op) {
    case '–':
      return '-';

    case 'x²':
      return '^{2}';

    case 'x³':
      return '^{3}';

    case 'x!':
      return '{!}';

    case '%':
      return '{\\%}';

    default:
      return op;
  }
}

function parseSymbol(symbol, displayMode) {
  switch (displayMode) {
    case 'decimal':
      return convertFracToDecimal(symbol.evaluate().toString());

    default:
      return symbol.toString();
  }
}

function parseFunc(func) {
  let arg;
  let preArg;

  if (func.argument) {
    arg = prepareArg(func.argument);
  }
  if (func.preArgument) {
    preArg = prepareArg(func.preArgument);
  }

  switch (func.function) {
    case 'numerator':
      return '\\large \\frac {' + parseToTeX(arg) + '}';

    case 'denominator':
      return '{' + parseToTeX(arg) + '} \\normalsize';

    case '√(x)':
      return '\\sqrt {' + parseToTeX(arg) + '}';

    case '(':
      if (safeArgClosed(func)) {
        return '\\left(' + parseToTeX(arg) + '\\right)';
      } else {
        return '(' + parseToTeX(func.argument);
      }

    case 'base':
      return parseToTeX(arg);

    case 'exponent':
      return '^{' + parseToTeX(arg) + '}';

    case 'xⁿ':
      return preArg + '^{' + parseToTeX(arg) + '}';

    default:
      if (safeArgClosed(func)) {
        return (
          funcToTeXMap(func.function) + '\\left(' + parseToTeX(arg) + '\\right)'
        );
      } else if (func !== ')' && func !== 'cArg' && func !== 'box') {
        return (
          funcToTeXMap(func.function) + '(' + parseToTeX(func.argument, this)
        );
      } else {
        switch (func) {
          case ')':
            return ')';

          case 'box':
            return '{\\Box}';
        }
      }
  }
}

function prepareArg(arg) {
  let updatedArg = arg.filter(x => x !== ')');
  updatedArg = updatedArg.filter(x => buttonType(x) !== 'cArg');
  return boxIfArgEmpty(updatedArg);
}

function funcToTeXMap(func) {
  switch (func) {
    case '|x|':
      return '\\text {Abs}'; // vertical bars would conflict with cursor character

    case 'log(x)':
      return '\\log';

    case 'ln(x)':
      return '\\ln';

    case '√(x)':
      return '\\sqrt';

    case 'sin(x)':
      return '\\sin';

    case 'cos(x)':
      return '\\cos';

    case 'tan(x)':
      return '\\tan';

    case 'sin⁻¹':
      return '\\sin^{-1}';

    case 'cos⁻¹':
      return '\\cos^{-1}';

    case 'tan⁻¹':
      return '\\tan^{-1}';

    case '(':
      return '';

    case ')':
      return ')';

    default:
      return func;
  }
}

function safeArgClosed(el) {
  if (el) {
    if (el.argument) {
      if (el.argument.includes(')')) {
        return true;
      }
    }
  }
  return false;
}
