const Fraction = require('fraction.js');
import { Decimal } from 'decimal.js';
import { buttonType } from './ButtonType';

//This will become more complicated to deal with fractions etc.
export function parseToRender(
  arr,
  cursorPosition = -1,
  displayMode = 'default'
) {
  if (cursorPosition >= 0) {
    arr = addCursor(arr, cursorPosition);
  }

  let i,
    str = '';
  for (i = 0; i < arr.length; i++) {
    str += parseElement(arr[i], displayMode);
  }

  return str;
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '¦');
  arr.splice(position, 0, '¦');
  return arr;
}

function parseElement(el, displayMode = 'default') {
  const type = buttonType(el);
  switch (type) {
    case 'number':
      return parseNumber(el, displayMode);

    case 'operator':
      return opToStringMap(el);

    case 'function':
      if (el.function) {
        const func = funcToStringMap(el.function);
        if (el.argument) {
          return func + parseToRender(el.argument);
        } else {
          return func;
        }
      } else {
        return el;
      }

    default:
      return el;
  }
}

function parseNumber(el, displayMode = 'default') {
  if (el === '(-)') {
    el = '-';
  }

  switch (displayMode) {
    case 'fraction':
      if (!checkNumComplexity(el)) {
        el = new Fraction(el);
        return el.toFraction();
      } else {
        return el;
      }

    case 'decimal':
      if (el.includes('/')) {
        el = new Fraction(el);
        return el.toString();
      } else {
        return el;
      }

    default:
      return el;
  }
}

function checkNumComplexity(el) {
  //Check whether el is too complicated to represent as a fraction
  if (!el.includes('/')) {
    el = new Decimal(el);
    if (
      el < 100000 &&
      el.toFraction(10000).toString() === el.toFraction(100000).toString()
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    //el is already a fraction
    return false;
  }
}

function opToStringMap(op) {
  switch (op) {
    case 'x²':
      return '²';

    case 'x³':
      return '³';

    case 'x⁻¹':
      return '⁻¹';

    case 'x!':
      return '!';

    default:
      return op;
  }
}

function funcToStringMap(func) {
  switch (func) {
    case '|x|':
      return '|';

    case 'log(x)':
      return 'log(';

    case 'ln(x)':
      return 'ln(';

    case '√(x)':
      return '√(';

    case 'sin(x)':
      return 'sin(';

    case 'cos(x)':
      return 'cos(';

    case 'tan(x)':
      return 'tan(';

    case 'sin⁻¹':
      return 'sin⁻¹(';

    case 'cos⁻¹':
      return 'cos⁻¹(';

    case 'tan⁻¹':
      return 'tan⁻¹(';

    case '(':
      return '(';

    case ')':
      return ')';

    default:
      return func;
  }
}
