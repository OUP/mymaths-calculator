//See https://khan.github.io/KaTeX/function-support.html for reference
const Fraction = require('fraction.js');
import Decimal from 'decimal.js/decimal';
import { identicalArrays, checkIfFraction, reduceDecimal } from '../Utilities';
import parseSymbol from './parseSymbol';

const TeX = {
  number: parseNumber,
  operator: parseOperator,
  symbol: parseSymbol,
  func: funcToTeXMap,
  error: parseError,
  openBracket: '\\left(',
  closeBracket: '\\right)',
  ans: '\\text {Ans}',
  ran: '\\text {Ran\\#}',
  cursor: '{\\text{|}}',
  box: '{\\Box}'
};

export default TeX;

function parseNumber(num, displayMode) {
  switch (displayMode) {
    case 'fraction':
      return parseNumFractionMode(num);

    case 'decimal':
      return parseNumDecimalMode(num);

    case 'mixed':
      return parseNumMixedMode(num);

    case 'ENG0':
    case 'ENG1':
    case 'ENG2':
      return parseNumENGMode(num, displayMode);

    default:
    case 'default':
      return parseNumInputMode(num);
  }
}

function parseNumInputMode(num) {
  if (!checkIfFraction(num)) {
    return num.toString();
  } else {
    num = new Fraction(num);
    return genFraction(num.n, num.d);
  }
}

function parseNumFractionMode(num) {
  if (!checkIfFraction(num) && !num.includes('(')) {
    num = new Decimal(num);
    const testFracEl = num.toFraction(1000);
    const fracEl = num.toFraction();
    if (fracEl[1].toString() !== '1' && identicalArrays(fracEl, testFracEl)) {
      return genFraction(new Fraction(fracEl[0].div(fracEl[1]).toString()));
    } else {
      return reduceDecimal(num);
    }
  } else {
    num = new Fraction(num);
    return genFraction(num);
  }
}

function parseNumDecimalMode(num) {
  if (!checkIfFraction(num)) {
    return reduceDecimal(num);
  } else {
    num = new Fraction(num);
    num = num.toString();
    return genRecurringDecimal(num);
  }
}

function parseNumENGMode(num, displayMode) {
  const eng0Val = engMaxPow10(num);
  switch (displayMode) {
    case 'ENG0':
      return `${new Decimal(num)
        .div(Math.pow(10, eng0Val))
        .toString()} × 10^{${eng0Val.toString()}}`;

    case 'ENG1':
      return `${new Decimal(num)
        .div(Math.pow(10, eng0Val - 3))
        .toString()} × 10^{${(eng0Val - 3).toString()}}`;

    case 'ENG2':
      return `${new Decimal(num)
        .div(Math.pow(10, eng0Val - 6))
        .toString()} × 10^{${(eng0Val - 6).toString()}}`;
  }
}

function parseNumMixedMode(num) {
  if (!checkIfFraction(num) && !num.includes('(')) {
    num = new Decimal(num);
    const testFracEl = num.toFraction(1000);
    const fracEl = num.toFraction();
    if (fracEl[1].toString() !== '1' && identicalArrays(fracEl, testFracEl)) {
      return genMixedFraction(
        new Fraction(fracEl[0].div(fracEl[1]).toString())
      );
    } else {
      return reduceDecimal(num);
    }
  } else {
    num = new Fraction(num);
    return genMixedFraction(num);
  }
}

function parseOperator(op) {
  switch (op) {
    case '–':
      return '-';

    case 'xⁿ':
      return '{}^';

    case 'x!':
      return '{!}';

    case '%':
      return '{\\%}';

    case 'nCr':
      return '\\text{C}';

    case 'nPr':
      return '\\text{P}';

    default:
      return op;
  }
}

function parseError(error) {
  return `\\text{${error}}`;
}

function funcToTeXMap(func) {
  switch (func) {
    case 'numerator':
    case 'fraction':
      return '\\large \\frac';

    case '|x|':
      return '\\text {Abs}'; // vertical bars would conflict with cursor character

    case 'xⁿ':
    case 'root':
      return '{}^';

    case 'log(x)':
      return '\\log';

    case 'ln(x)':
      return '\\ln';

    case '√(x)':
    case 'rootBase':
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

    case 'logₐ(x)':
      return '\\log_';

    case 'eⁿ':
      return 'e^';

    default:
      return func;
  }
}

function genFraction({ n, s, d }) {
  if (s === 1) {
    return `${funcToTeXMap('fraction')}
  { ${n} } { ${d} }
  \\normalsize`;
  } else {
    return `${funcToTeXMap('fraction')}
    { -${n} } { ${d} }
    \\normalsize`;
  }
}

function genMixedFraction({ n, s, d }) {
  const integer = Math.floor(n / d);
  const numerator = n - integer * d;
  if (s === 1) {
    return (
      integer +
      `${funcToTeXMap('fraction')}
  { ${numerator} } { ${d} }
  \\normalsize`
    );
  } else {
    const negInteger = integer * -1;
    return (
      negInteger +
      `${funcToTeXMap('fraction')}
    { ${numerator} } { ${d} }
    \\normalsize`
    );
  }
}

function genRecurringDecimal(decimal) {
  const decArray = decimal.split('');
  for (let i = 0; i < decArray.length; i++) {
    if (decArray[i] === '(') {
      decArray.splice(i, 2, `\\dot{ ${decArray[i + 1]} }`);
    } else if (decArray[i] === ')') {
      if (decArray[i - 1].includes('\\dot')) {
        decArray.pop();
      } else {
        decArray.splice(i - 1, 2, `\\dot{ ${decArray[i - 1]} }`);
      }
    }
  }
  return decArray.join('');
}

function engMaxPow10(num) {
  const pow10 = Math.floor(Math.log10(parseFloat(num)));
  return pow10 >= 0 ? pow10 - (pow10 % 3) : pow10 - (pow10 % 3) - 3;
}
