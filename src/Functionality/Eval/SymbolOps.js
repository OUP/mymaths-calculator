import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import { FractionExpression, Term, Expression } from '../Classes/Symbol';
import { numericOp } from './NumericOp';
import { identicalArrays } from '../Utilities';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';

export function symbolicOp(v1, operation, v2 = 0) {
  v1 = construct(v1);
  if (typeof v2 !== 'undefined') {
    v2 = construct(v2);
  }
  switch (operation) {
    case 'xⁿ':
      const v2Val = v2.evaluate();
      const v2ValStr = v2Val.toString();
      if (!v2ValStr.includes('/') && !v2ValStr.includes('.')) {
        return symbolPow(v1, v2Val);
      } else {
        return numericOp(v1.evaluate(), 'xⁿ', v2Val);
      }

    case 'x!':
      break; //WiP

    case '%':
      return v1.divBy(100);

    case '÷':
      return v1.divBy(v2);

    case '×':
      return v1.times(v2);

    case '–':
      return v1.minus(v2);

    case '+':
      return v1.plus(v2).simplify();

    default:
      console.error("Don't know how to do the operation " + operation);
      return ['error'];
  }
}

function construct(x) {
  let term, exp;
  const defaultDenom = new Expression(new Term(1));
  switch (x.constructor) {
    case String:
      if (x.includes('π')) {
        term = new Term(1, ['π'], [1]);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (parseFloat(x).toString() === x) {
        term = new Term(parseFloat(x));
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom);
      } else if (x.includes('√')) {
        term = new SquareRoot(x);
        exp = new SqrtExpression([term]);
        return new SqrtFractionExpression(exp, defaultDenom);
      }
      break;

    case Fraction:
    case Decimal:
      term = new Term(x);
      exp = new Expression([term]);
      return new FractionExpression(exp, defaultDenom);

    default:
      return x;
  }
}

export function funcOnSymbol(func, arg, arg2) {
  arg = construct(arg);
  if (arg2 !== 'undefined') {
    arg2 = construct(arg2);
  }
  switch (func) {
    case 'numerator':
      if (arg.constructor === FractionExpression) {
        return arg.divBy(arg2).simplify();
      } else if (arg2.constructor === FractionExpression) {
        return arg2
          .reciprocal()
          .times(arg)
          .simplify();
      } else {
        break;
      }

    case '|x|':
      return arg.abs();

    case 'base':
      const arg2Val = arg2.evaluate();
      const arg2ValStr = arg2Val.toString();
      if (!arg2ValStr.includes('/') && !arg2ValStr.includes('.')) {
        return symbolPow(arg, arg2Val);
      } else {
        return numericOp(arg.evaluate(), arg2Val);
      }

    case 'log(x)':
      return arg.log(10);

    case 'ln(x)':
      return arg.ln();

    case '√(x)':
      return arg.sqrt();

    case 'sin(x)':
      return symbolTrig('sin', arg);

    case 'cos(x)':
      return symbolTrig('cos', arg);

    case 'tan(x)':
      return symbolTrig('tan', arg);

    case 'sin⁻¹':
      return arg.asin();

    case 'cos⁻¹':
      return arg.acos();

    case 'tan⁻¹':
      return arg.atan();

    case '(':
      return arg;
  }
}

function symbolPow(base, exponent) {
  exponent = parseInt(exponent.toString(), 10);
  switch (true) {
    case exponent > 0:
      let result = 1;
      for (let i = 1; i <= exponent; i++) {
        result = base.times(result);
      }
      return result;

    case exponent === 0:
      return '1';

    case exponent < 0:
      return symbolPow(base, -exponent).reciprocal();
  }
}

function symbolTrig(trigFunc, arg) {
  if (isMultipleOfPi(arg)) {
    return trigWithPi(trigFunc, arg);
  } else {
    return standardTrigFunc(trigFunc, arg.evaluate());
  }
}

function isMultipleOfPi(arg) {
  if (
    numeratorIsMultipleOfPi(arg.numerator) &&
    denominatorIsConstant(arg.denominator)
  ) {
    return true;
  } else {
    return false;
  }
}

function numeratorIsMultipleOfPi(numerator) {
  const terms = numerator.terms;
  if (terms.length === 1) {
    const powers = terms[0].powers;
    const symbols = terms[0].symbols;
    if (identicalArrays(symbols, ['π']) && powers[0].toString() === '1') {
      return true;
    }
  }
  return false;
}

function denominatorIsConstant(denominator) {
  const terms = denominator.terms;
  if (terms.length === 1) {
    if (identicalArrays(terms[0].symbols, [])) {
      return true;
    }
  }
  return false;
}

function standardTrigFunc(trigFunc, arg) {
  if (arg.constructor !== Decimal) {
    arg = generateDecimal(arg);
  }
  switch (trigFunc) {
    case 'sin':
      return arg.sin();

    case 'cos':
      return arg.cos();

    case 'tan':
      return arg.tan();

    default:
      console.warn('invalid trigFunc');
      return '0';
  }
}

function generateDecimal(value) {
  switch (value.constructor) {
    case String:
      return convertFracStringToDecimal(value);

    case Fraction:
      return convertFracStringToDecimal(value.toString());

    case Decimal:
      return value;

    case Number:
    default:
      return new Decimal(value);
  }
}

function trigWithPi(trigFunc, arg) {
  const coefficient = setCoefficient(arg);

  switch (trigFunc) {
    case 'sin':
      return sinWithPi(coefficient);

    case 'cos':
      return cosWithPi(coefficient);

    case 'tan':
      return tanWithPi(coefficient);

    default:
      console.warn('trig breakdown');
      return 0;
  }
}

function setCoefficient(arg) {
  const coefficient = numericOp(
    arg.numerator.terms[0].coefficient.toString(),
    '÷',
    arg.denominator.terms[0].coefficient.toString()
  ).toString();
  return new Fraction(coefficient).mod(2).toString();
}

function sinWithPi(coefStr) {
  switch (coefStr) {
    case '0':
    case '1':
    case '2':
      return '0';

    case '1/6':
    case '0.1(6)':
    case '5/6':
    case '0.8(3)':
      return '0.5';

    case '0.25':
    case '1/4':
    case '0.75':
    case '3/4':
      return '√2/2';

    case '0.(3)':
    case '1/3':
    case '2/3':
    case '0.(6)':
      return '√3/2';

    case '0.5':
    case '1/2':
      return '1';

    case '7/6':
    case '1.1(6)':
    case '11/6':
    case '1.8(3)':
      return '-0.5';

    case '1.25':
    case '5/4':
    case '1.75':
    case '7/4':
      return '-√2/2';

    case '1.(3)':
    case '4/3':
    case '5/3':
    case '1.(6)':
      return '-√3/2';

    case '1.5':
    case '3/2':
      return '-1';

    default:
      const coef = convertFracStringToDecimal(coefStr);
      return standardTrigFunc('sin', coef.times(Math.PI));
  }
}

function cosWithPi(coefStr) {
  switch (coefStr) {
    case '0':
    case '2':
      return '1';

    case '1/6':
    case '0.1(6)':
    case '11/6':
    case '1.8(3)':
      return '√3/2';

    case '0.25':
    case '1/4':
    case '1.75':
    case '7/4':
      return '√2/2';

    case '0.(3)':
    case '1/3':
    case '5/3':
    case '1.(6)':
      return '0.5';

    case '0.5':
    case '1/2':
    case '1.5':
    case '3/2':
      return '0';

    case '2/3':
    case '0.(6)':
    case '4/3':
    case '1.(3)':
      return '-0.5';

    case '0.75':
    case '3/4':
    case '1.25':
    case '5/4':
      return '-√2/2';

    case '0.8(3)':
    case '5/6':
    case '1.1(6)':
    case '7/6':
      return '-√3/2';

    case '1':
      return '-1';

    default:
      const coef = convertFracStringToDecimal(coefStr);
      return standardTrigFunc('cos', coef.times(Math.PI));
  }
}

function tanWithPi(coefStr) {
  switch (coefStr) {
    case '0':
    case '1':
    case '2':
      return '0';

    case '1/6':
    case '0.1(6)':
    case '7/6':
    case '1.1(6)':
      return '√3/3';

    case '0.25':
    case '1/4':
    case '1.25':
    case '5/4':
      return '1';

    case '0.(3)':
    case '1/3':
    case '4/3':
    case '1.(3)':
      return '√3';

    case '0.5':
    case '1/2':
    case '1.5':
    case '3/2':
      return 'Maths error';

    case '2/3':
    case '0.(6)':
    case '5/3':
    case '1.(6)':
      return '-√3';

    case '0.75':
    case '3/4':
    case '1.75':
    case '7/4':
      return '-1';

    case '0.8(3)':
    case '5/6':
    case '1.8(3)':
    case '11/6':
      return '-√3/3';

    default:
      const coef = convertFracStringToDecimal(coefStr);
      return standardTrigFunc('tan', coef.times(Math.PI));
  }
}

function convertFracStringToDecimal(fracString) {
  if (fracString.includes('/')) {
    const fraction = new Fraction(fracString);
    return new Decimal(fraction.n).div(fraction.d).times(fraction.s);
  } else {
    return new Decimal(fracString);
  }
}
