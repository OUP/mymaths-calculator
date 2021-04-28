import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import { numericOp } from './NumericOp';
import { identicalArrays } from '../Utilities';
import { sqrtFactory } from '../Classes/Surd';
import { generateDecimal, convertFracStringToDecimal } from './GenerateDecimal';

export default function radTrig(trigFunc, arg) {
  if (isMultipleOfPi(arg)) {
    return trigWithPi(trigFunc, arg);
  } else {
    return standardTrigFunc(trigFunc, arg);
  }
}

function isMultipleOfPi(arg) {
  if (
    arg.denominator &&
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
  if (arg.evaluate) {
    arg = arg.evaluate();
  }
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
      return sqrtFactory('√2').div(2);

    case '0.(3)':
    case '1/3':
    case '2/3':
    case '0.(6)':
      return sqrtFactory('√3').div(2);

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
      return sqrtFactory('√2')
        .div(2)
        .timesMinusOne();

    case '1.(3)':
    case '4/3':
    case '5/3':
    case '1.(6)':
      return sqrtFactory('√3')
        .div(2)
        .timesMinusOne();

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
      return sqrtFactory('√3').div(2);

    case '0.25':
    case '1/4':
    case '1.75':
    case '7/4':
      return sqrtFactory('√2').div(2);

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
      return sqrtFactory('√2')
        .div(2)
        .timesMinusOne();

    case '0.8(3)':
    case '5/6':
    case '1.1(6)':
    case '7/6':
      return sqrtFactory('√3')
        .div(2)
        .timesMinusOne();

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
      return sqrtFactory('√3').div(3);

    case '0.25':
    case '1/4':
    case '1.25':
    case '5/4':
      return '1';

    case '0.(3)':
    case '1/3':
    case '4/3':
    case '1.(3)':
      return sqrtFactory('√3');

    case '0.5':
    case '1/2':
    case '1.5':
    case '3/2':
      return 'Maths error';

    case '2/3':
    case '0.(6)':
    case '5/3':
    case '1.(6)':
      return sqrtFactory('√3').timesMinusOne();

    case '0.75':
    case '3/4':
    case '1.75':
    case '7/4':
      return '-1';

    case '0.8(3)':
    case '5/6':
    case '1.8(3)':
    case '11/6':
      return sqrtFactory('√3')
        .div(3)
        .timesMinusOne();

    default:
      const coef = convertFracStringToDecimal(coefStr);
      return standardTrigFunc('tan', coef.times(Math.PI));
  }
}
