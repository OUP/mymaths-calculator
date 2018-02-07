const Fraction = require('fraction.js');
import { Decimal } from 'decimal.js';

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
  if (typeof el === 'string') {
    if (displayMode === 'default') {
      return opToStringMap(el);
    } else if (displayMode === 'fraction') {
      if (!el.includes('/')) {
        console.log('el', el);
        const decimal = new Decimal(el);
        if (decimal.toFraction() === decimal.toFraction(10000)) {
          const frac = new Fraction(el);
          return frac.toFraction();
        } else {
          return decimal;
        }
      } else {
        const frac = new Fraction(el);
        return frac.toFraction();
      }
    } else if (displayMode === 'decimal') {
      if (!el.includes('/')) {
        const decimal = new Decimal(el);
        return decimal;
      } else {
        const recDec = new Fraction(el);
        return recDec.toString();
      }
    }
  } else if (typeof el === 'number') {
    return el.toString();
  } else if (el.constructor === Array) {
    return el[0].toString();
  } else {
    return funcToStringMap(el.function) + parseToRender(el.argument);
  }
}

function opToStringMap(op) {
  switch (op) {
    case 'x²':
      return '²';

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

    case '(':
      return '(';

    default:
      return "didn't render";
  }
}
