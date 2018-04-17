const Fraction = require('fraction.js');
import Decimal from 'decimal.js/decimal';
import { convertFracToDecimal, identicalArrays } from '../Utilities';

const TeX = {
  number: parseNumber,
  operator: parseOperator,
  symbol: parseSymbol,
  func: funcToTeXMap,
  openBracket: '\\left(',
  closeBracket: '\\right)',
  ans: '\\text {Ans}',
  cursor: '{\\text{|}}',
  box: '{\\Box}',
  error: '\\text{TeX error}'
};

export default TeX;

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

function funcToTeXMap(func) {
  switch (func) {
    case 'numerator':
      return '\\large \\frac';

    case 'exponent':
      return '^';

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
