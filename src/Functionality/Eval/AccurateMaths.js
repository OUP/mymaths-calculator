//Arbitrary precision arithmetic
import Decimal from 'decimal.js/decimal';
import buttonType from '../ButtonType';
import { funcOnSymbol } from './SymbolOps';
import { fractionOp } from './FractionOps';
import { checkForSymbols, checkIfFraction, isInteger } from '../Utilities';
import trig from './Trig';
import inverseTrig from './InverseTrig';
const Fraction = require('fraction.js');

export function accurateOp(v1, operation, v2 = 0) {
  v1 = initOp(v1, operation);
  v2 = initOp(v2, operation);
  switch (operation) {
    case 'xⁿ':
      return accPower(v1, v2);

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

    case 'nPr':
      return nPr(v1, v2);

    case 'nCr':
      return nCr(v1, v2);

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
    !checkIfFraction(v) &&
    buttonType(v) !== 'sqrt' &&
    buttonType(v) !== 'symbol'
  ) {
    return new Decimal(v.toString());
  } else if (buttonType(v) === 'symbol' || buttonType(v) === 'sqrt') {
    return v;
  } else {
    return new Fraction(v.toString());
  }
}

export function accurateFunc(func, arg, angleMode, arg2) {
  arg = initOp(arg, func);
  arg2 = initOp(arg2, func);
  if (checkForSymbols(arg) || checkForSymbols(arg2)) {
    return funcOnSymbol(func, arg, angleMode, arg2);
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
        const sqrt = Math.sqrt(arg);
        return isInteger(sqrt) ? sqrt : `√${arg}`;

      case 'root':
        return nthRoot(arg, arg2);

      case 'sin(x)':
        return trig('sin', angleMode, arg);

      case 'cos(x)':
        return trig('cos', angleMode, arg);

      case 'tan(x)':
        return trig('tan', angleMode, arg);

      case 'sin⁻¹':
      case 'cos⁻¹':
      case 'tan⁻¹':
        return inverseTrig(func, angleMode, arg);

      case 'logₐ(x)':
        return arg2.log(arg);

      case '(':
        return arg;
    }
  }
}

const factorial = function recur(v1, index = 1, result = 1) {
  if (v1.gte(0) && v1.round().eq(v1)) {
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
  return isPosExponent(exponent)
    ? posPower(base, exponent)
    : negPower(base, exponent);
}

function isPosExponent(exponent) {
  return !exponent.toString().includes('-');
}

function posPower(base, exponent) {
  if (isValidPower(base, exponent)) {
    return base.toPower(exponent);
  } else {
    throw { name: 'Maths error' };
  }
}

function negPower(base, exponent) {
  if (isValidPower(base, exponent)) {
    return new Fraction(1).div(base.toPower(exponent.abs()).toString());
  } else {
    throw { name: 'Maths error' };
  }
}

function isValidPower(base, exponent) {
  return isNonzero(base) || isNonzero(exponent);
}

function isNonzero(val) {
  return parseFloat(val.toString()) !== 0;
}

function nPr(n, r) {
  return accurateOp(
    accurateOp(n, 'x!'),
    '÷',
    accurateOp(accurateOp(n, '–', r), 'x!')
  );
}

function nCr(n, r) {
  return accurateOp(accurateOp(n, 'nPr', r), '÷', accurateOp(r, 'x!'));
}

function nthRoot(n, rootBase) {
  const exponent = accurateOp(1, '÷', n);
  return fractionOp(rootBase.toString(), 'xⁿ', exponent);
}
