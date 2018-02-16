//Arbitrary precision arithmetic
import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');

export function accurateOp(v1, operation, v2 = 0) {
  switch (operation) {
    case 'xⁿ':
      return pow(v1, v2);

    case 'x²':
      return multiply(v1, v1);

    case 'x³':
      return multiply(multiply(v1, v1), v1);

    case 'x⁻¹':
      return divide('1', v1);

    case 'x!':
      return factorial(v1);

    case '÷':
      return divide(v1, v2);

    case '×':
      return multiply(v1, v2);

    case '×10ⁿ':
      return pow10(v1, v2);
    //v1 * Math.pow(10, v2);

    case '–':
      return subtract(v1, v2);

    case '+':
      return add(v1, v2);

    default:
      console.error("Don't know how to do the operation " + operation);
      return ['error'];
  }
}

export function accurateFunc(func, preArg, arg) {
  switch (func) {
    case '|x|':
      return Math.abs(arg);

    case 'xⁿ':
      return pow(preArg, arg);

    case 'log(x)':
      return Math.log10(arg);

    case 'ln(x)':
      return Math.log(arg);

    case '√(x)':
      return Math.sqrt(arg);

    case 'sin(x)':
      return Math.sin(arg);

    case 'cos(x)':
      return Math.cos(arg);

    case 'tan(x)':
      return Math.tan(arg);

    case 'sin⁻¹':
      return Math.asin(arg);

    case 'cos⁻¹':
      return Math.acos(arg);

    case 'tan⁻¹':
      return Math.atan(arg);

    case '(':
      return arg;
  }
}

//v1 + v2
function add(v1, v2) {
  v1 = new Decimal(v1);
  v2 = new Decimal(v2);
  return v1.add(v2);
}

//v1 - v2
function subtract(v1, v2) {
  v1 = new Decimal(v1);
  v2 = new Decimal(v2);
  return v1.minus(v2);
}

//v1 * v2
function multiply(v1, v2) {
  v1 = new Decimal(v1);
  v2 = new Decimal(v2);
  return v1.times(v2);
}

//v1 / v2
function divide(v1, v2) {
  const f = new Fraction(v1, v2);
  return f.toFraction();
}

//v1 ^ v2
function pow(v1, v2) {
  v1 = new Decimal(v1);
  v2 = new Decimal(v2);
  return v1.toPower(v2);
}

function pow10(v1, v2) {
  v1 = new Decimal(v1);
  v2 = new Decimal(v2);
  const ten = new Decimal(10);
  return v1.times(ten.toPower(v2));
}

const factorial = function recur(v1, index = 1, result = 1) {
  if (Math.round(v1) === v1) {
    result = multiply(result, index);
    if (index < v1) {
      return recur(v1, index + 1, result);
    } else {
      return result;
    }
  } else {
    return 'Syntax error. Use integers for x!';
  }
};
