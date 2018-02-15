import katex from 'katex';
const Fraction = require('fraction.js');
//import Decimal from 'decimal.js/decimal';
import { buttonType } from './ButtonType';
import { assembleNumbers, assembleArguments } from './CalcEval';
import '../UI/Maths.css';

export function parseToRender(
  arr,
  id,
  cursorPosition = -1,
  displayMode = 'default'
) {
  const maths = parseToMaths(arr, cursorPosition, displayMode);
  if (document.getElementById(id)) {
    if (maths) {
      katex.render(maths, document.getElementById(id));
    } else {
      katex.render('', document.getElementById(id));
    }
  }
}

function parseToMaths(arr, cursorPosition, displayMode) {
  if (cursorPosition >= 0) {
    arr = addCursor(arr, cursorPosition);
  }
  arr = assembleNumbers(arr);
  arr = assembleArguments(arr);
  return arr
    .map(parseElToMaths)
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
      if (!el.includes('/')) {
        return el.toString();
      } else {
        el = new Fraction(el);
        return '\\frac {' + el.n + '} {' + el.d + '}';
      }

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

        default:
          return el;
      }

    case 'function':
      let dispArg;
      switch (el.function) {
        case '√(x)':
          dispArg = el.argument.filter(x => x !== 'cArg');
          return '\\sqrt {' + parseToMaths(dispArg) + '}';

        case '(':
          if (safeArgClosed(el)) {
            dispArg = el.argument.filter(x => x !== ')');
            dispArg = dispArg.filter(x => buttonType(x) !== 'cArg');
            return '\\left(' + parseToMaths(dispArg) + '\\right)';
          } else {
            return '(' + parseToMaths(el.argument);
          }

        default:
          if (safeArgClosed(el)) {
            dispArg = el.argument.filter(x => x !== ')');
            dispArg = dispArg.filter(x => buttonType(x) !== 'cArg');
            return (
              funcToStringMap(el.function) +
              '\\left(' +
              parseToMaths(dispArg) +
              '\\right)'
            );
          } else if (el !== ')' && el !== 'cArg') {
            return (
              funcToStringMap(el.function) + '(' + parseToMaths(el.argument)
            );
          } else {
            switch (el) {
              case ')':
                return ')';
            }
          }
      }
      break;

    case 'cArg':
      break;

    default:
      return '{\\text{｜}}';
  }
}

function funcToStringMap(func) {
  switch (func) {
    case '|x|':
      return '|';

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
