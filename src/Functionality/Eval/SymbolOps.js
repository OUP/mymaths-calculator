import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import { FractionExpression, Term, Expression } from '../Classes/Symbol';
import { numericOp } from './NumericOp';
import { identicalArrays, checkIfFraction } from '../Utilities';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';
import processValue from './ProcessValue';

export function symbolicOp(v1, operation, v2 = 0) {
  if (needToReverseOrder(v1, operation, v2)) {
    /**
     * This is necessary because the methods from fraction.js
     * and decimal.js can't take the calculator's symbolic and
     * square root classes as parameters
     */
    return reversedOrderOp(v1, operation, v2);
  }
  v1 = construct(v1);
  if (typeof v2 !== 'undefined') {
    v2 = construct(v2);
  }

  let result;

  switch (operation) {
    case 'xⁿ':
      const v2Val = v2.evaluate();
      const v2ValStr = v2Val.toString();
      if (!checkIfFraction(v2ValStr) && !v2ValStr.includes('.')) {
        result = symbolPow(v1, v2Val);
      } else {
        result = numericOp(v1.evaluate(), 'xⁿ', v2Val);
      }
      break;

    case 'x!':
      break; //WiP

    case '%':
      result = v1.div(100);
      break;

    case '÷':
      result = v1.div(v2);
      break;

    case '×':
      result = v1.times(v2);
      break;

    case '–':
      result = v1.minus(v2);
      break;

    case '+':
      result = v1.plus(v2).simplify();
      break;

    default:
      console.error("Don't know how to do the operation " + operation);
      result = ['error'];
      break;
  }
  return processValue(result);
}

function construct(x) {
  let term, exp;
  const defaultDenom = new Expression(new Term(1));
  switch (true) {
    case x.constructor === String:
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
      } else if (x.includes('/')) {
        term = new Term(x);
        exp = new Expression([term]);
        return new FractionExpression(exp, defaultDenom).simplify();
      }
      break;

    case checkIfFraction(x):
    case x.constructor === Decimal:
      term = new Term(x);
      exp = new Expression([term]);
      return new FractionExpression(exp, defaultDenom);

    default:
      return x;
  }
}

export function funcOnSymbol(func, arg, arg2) {
  arg = construct(arg);
  if (typeof arg2 !== 'undefined') {
    arg2 = construct(arg2);
  }

  let result;

  switch (func) {
    case 'numerator':
      result = symbolicOp(arg, '÷', arg2);
      break;

    case '|x|':
      result = arg.abs();
      break;

    case 'log(x)':
      result = arg.log(10);
      break;

    case 'ln(x)':
      result = arg.ln();
      break;

    case '√(x)':
      result = arg.sqrt();
      break;

    case 'sin(x)':
      result = symbolTrig('sin', arg);
      break;

    case 'cos(x)':
      result = symbolTrig('cos', arg);
      break;

    case 'tan(x)':
      result = symbolTrig('tan', arg);
      break;

    case 'sin⁻¹':
      result = arg.asin();
      break;

    case 'cos⁻¹':
      result = arg.acos();
      break;

    case 'tan⁻¹':
      result = arg.atan();
      break;

    case '(':
      result = arg;
      break;
  }
  return processValue(result);
}

function needToReverseOrder(v1, operation, v2) {
  switch (operation) {
    case '+':
    case '–':
    case '×':
    case '÷':
      return (
        typeof v1.conString === 'undefined' &&
        typeof v2.conString === 'function'
      );
    /**
     * conString is a method which exists on symbols and
     * square roots but not on fractions and decimals
     */

    default:
      return false;
  }
}

function reversedOrderOp(v1, operation, v2) {
  //v1 and v2 are still in the original order in params
  switch (operation) {
    case '+':
      return symbolicOp(v2, '+', v1);

    case '–':
      return symbolicOp(v2.timesMinusOne(), '+', v1);

    case '×':
      return symbolicOp(v2, '×', v1);

    case '÷':
      return symbolicOp(v2.reciprocal(), '×', v1);
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
  if (checkIfFraction(fracString)) {
    const fraction = new Fraction(fracString);
    return new Decimal(fraction.n).div(fraction.d).times(fraction.s);
  } else {
    return new Decimal(fracString);
  }
}
