//Arbitrary precision arithmetic
import Decimal from 'decimal.js/decimal';
import buttonType from '../ButtonType';
import { funcOnSymbol } from './SymbolOps';
const Fraction = require('fraction.js');

export function accurateOp(v1, operation, v2 = 0) {
  v1 = initOp(v1, operation);
  v2 = initOp(v2, operation);
  switch (operation) {
    case 'xⁿ':
      return v1.toPower(v2);

    case 'x!':
      return factorial(v1);

    case '%':
      const oneHundred = new Fraction(100);
      return v1.div(oneHundred);

    case '÷':
      return v1.div(v2).toFraction();

    case '×':
      return v1.times(v2);

    case '–':
      return v1.minus(v2);

    case '+':
      return v1.add(v2);

    default:
      console.error("Don't know how to do the operation " + operation);
      return ['error'];
  }
}

function initOp(v, operation) {
  if (!v) {
    v = 0;
  }
  if (
    operation !== '÷' &&
    operation !== 'numerator' &&
    operation !== '%' &&
    !v.toString().includes('/') &&
    !v.toString().includes('\\sqrt') &&
    !v.toString().includes('√') &&
    buttonType(v) !== 'symbol'
  ) {
    return new Decimal(v.toString());
  } else if (buttonType(v) === 'symbol' || buttonType(v) === 'sqrt') {
    return v;
  } else {
    return new Fraction(v.toString());
  }
}

export function accurateFunc(func, arg, arg2) {
  arg = initOp(arg, func);
  arg2 = initOp(arg2, func);
  if (buttonType(arg) === 'symbol' || buttonType(arg2) === 'symbol') {
    return funcOnSymbol(func, arg, arg2);
  } else {
    switch (func) {
      case 'numerator':
        return arg.div(arg2).toFraction();

      case '|x|':
        return arg.abs();

      case 'base':
        return accPower(arg, arg2);

      case 'log(x)':
        return arg.log(10);

      case 'ln(x)':
        return arg.ln();

      case '√(x)':
        return `√${arg}`;

      case 'sin(x)':
        return arg.sin();

      case 'cos(x)':
        return arg.cos();

      case 'tan(x)':
        return arg.tan();

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
}

const factorial = function recur(v1, index = 1, result = 1) {
  if (v1.round().eq(v1)) {
    index = new Decimal(index.toString());
    result = index.times(result);
    if (index.lt(v1)) {
      return recur(v1, index.add(1), result);
    } else {
      return result;
    }
  } else {
    return 'Syntax error. Use integers for x!';
  }
};

export function accPower(base, exponent) {
  if (!exponent.toString().includes('-')) {
    //case with +ve power
    return base.toPower(exponent);
  } else {
    //case with -ve power
    return new Fraction('1/' + base.toPower(exponent.abs()).toString());
  }
}
