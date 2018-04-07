import katex from 'katex';
const Fraction = require('fraction.js');
import Decimal from 'decimal.js/decimal';
import buttonType from './ButtonType';
import { assembleNumbers, assembleArguments } from './Utilities';
import '../UI/Maths.css';
import { identicalArrays } from './Utilities';

export function parseToRender(
  arr,
  id,
  cursorPosition = -1,
  displayMode = 'default'
) {
  const maths = parseToMaths(arr, cursorPosition, displayMode);
  katex.render(maths, document.getElementById(id));
}

function parseToMaths(arr, cursorPosition = -1, displayMode = 'default') {
  if (arr.length > 1) {
    if (cursorPosition >= 0) {
      arr = addCursor(arr, cursorPosition);
    }
    arr = assembleNumbers(arr);
    arr = assembleArguments(arr);
  }

  return arr
    .map(parseElToMaths, displayMode)
    .join('')
    .toString();
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '¦');
  arr.splice(position, 0, '¦');
  return arr;
}

//Note: cArg denotes a hidden character
function parseElToMaths(el) {
  const bType = buttonType(el);
  switch (bType) {
    case 'number':
      switch (this) { //this is the displayMode
        case 'fraction':
          if (!el.includes('/') && !el.includes('(')) {
            el = new Decimal(el);
            const testFracEl = el.toFraction(1000);
            const fracEl = el.toFraction();
            if (
              fracEl[1].toString() !== '1' &&
              identicalArrays(fracEl, testFracEl)
            ) {
              return '\\large \\frac {' + fracEl[0] + '} {' + fracEl[1] + '}';
            } else {
              return el;
            }
          } else {
            el = new Fraction(el);
            return '\\large \\frac {' + el.n + '} {' + el.d + '}';
          }

        case 'default':
          if (!el.includes('/')) {
            return el.toString();
          } else {
            el = new Fraction(el);
            return '\\large \\frac {' + el.n + '} {' + el.d + '}';
          }

        case 'decimal':
          if (!el.includes('/')) {
            return el.toString();
          } else {
            el = new Fraction(el);
            el = el.toString();
            return genRecurringDecimal(el);
          }
      }
      break;

    case 'operator':
      switch (el) {
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
          return el;
      }

    case 'symbol':
    case 'sqrt':
      return el.toString();

    case 'Ans':
      return '\\text {' + el + '}';

    case 'function':
      let dispArg;
      let dispPreArg;
      switch (el.function) {
        case 'numerator':
          dispArg = el.argument.filter(x => buttonType(x) !== 'cArg');
          dispArg = boxIfArgEmpty(dispArg);
          return '\\large \\frac {' + parseToMaths(dispArg) + '}';

        case 'denominator':
          dispArg = el.argument.filter(x => buttonType(x) !== 'cArg');
          dispArg = boxIfArgEmpty(dispArg);
          return '{' + parseToMaths(dispArg) + '} \\normalsize';

        case '√(x)':
          dispArg = el.argument.filter(x => buttonType(x) !== 'cArg');
          dispArg = boxIfArgEmpty(dispArg);
          return '\\sqrt {' + parseToMaths(dispArg) + '}';

        case '(':
          if (safeArgClosed(el)) {
            dispArg = el.argument.filter(x => x !== ')');
            dispArg = dispArg.filter(x => buttonType(x) !== 'cArg');
            dispArg = boxIfArgEmpty(dispArg);
            return '\\left(' + parseToMaths(dispArg) + '\\right)';
          } else {
            return '(' + parseToMaths(el.argument);
          }

        case 'base':
          dispArg = el.argument.filter(x => buttonType(x) !== 'cArg');
          dispArg = boxIfArgEmpty(dispArg);
          return parseToMaths(dispArg);

        case 'exponent':
          dispArg = el.argument.filter(x => buttonType(x) !== 'cArg');
          dispArg = boxIfArgEmpty(dispArg);
          return '^{' + parseToMaths(dispArg) + '}';

        case 'xⁿ':
          dispPreArg = el.preArgument;
          dispPreArg = dispPreArg.filter(x => buttonType(x) !== 'cArg');
          dispPreArg = boxIfArgEmpty(dispPreArg);
          dispArg = el.argument.filter(x => buttonType(x) !== 'cArg');
          dispArg = boxIfArgEmpty(dispArg);
          return dispPreArg + '^{' + parseToMaths(dispArg) + '}';

        default:
          if (safeArgClosed(el)) {
            dispArg = el.argument.filter(x => x !== ')');
            dispArg = dispArg.filter(x => buttonType(x) !== 'cArg');
            dispArg = boxIfArgEmpty(dispArg);
            return (
              funcToStringMap(el.function) +
              '\\left(' +
              parseToMaths(dispArg) +
              '\\right)'
            );
          } else if (el !== ')' && el !== 'cArg' && el !== 'box') {
            return (
              funcToStringMap(el.function) +
              '(' +
              parseToMaths(el.argument, this)
            );
          } else {
            switch (el) {
              case ')':
                return ')';

              case 'box':
                return '{\\Box}';
            }
          }
      }
      break;

    case 'cArg':
      break;

    case 'oArg':
      return 'oArg';

    default:
      return '{\\text{|}}';
  }
}

function boxIfArgEmpty(dispArg) {
  if (!dispArg.length) {
    dispArg = ['box'];
  } else if (dispArg.length === 1 && dispArg[0] === '¦') {
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

function funcToStringMap(func) {
  switch (func) {
    case '|x|':
      return '\\text {Abs}';

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
