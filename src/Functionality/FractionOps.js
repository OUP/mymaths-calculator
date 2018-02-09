const Fraction = require('fraction.js');
import { Decimal } from 'decimal.js';

export function fractionOp(v1, operation, v2 = 0) {
  switch (operation) {
    case 'xⁿ':
      return fracPow(v1, v2);

    case 'x²':
      return fracMultiply(v1, v1);

    case 'x³':
      return fracMultiply(fracMultiply(v1, v1), v1);

    case 'x!':
      return fracFactorial(v1);

    case '÷':
      return fracDivide(v1, v2);

    case '×':
      return fracMultiply(v1, v2);

    case '×10ⁿ':
      return fracPow10(v1, v2);
    //v1 * Math.pow(10, v2);

    case '–':
      return fracSubtract(v1, v2);

    case '+':
      return fracAdd(v1, v2);

    default:
      console.error("Don't know how to do the operation " + operation);
      return ['error'];
  }
}

function fracAdd(v1, v2) {
  const f = new Fraction(v1);
  const g = new Fraction(v2);
  return f.add(g).toFraction();
}

function fracSubtract(v1, v2) {
  const f = new Fraction(v1);
  const g = new Fraction(v2);
  return f.sub(g).toFraction();
}

function fracMultiply(v1, v2) {
  const f = new Fraction(v1);
  const g = new Fraction(v2);
  return f.mul(g).toFraction();
}

function fracDivide(v1, v2) {
  const f = new Fraction(v1);
  const g = new Fraction(v2);
  return f.div(g).toFraction();
}

function fracPow(v1, v2) {
  const g = new Fraction(v2);
  //v2 integer
  if (v2 === g.toString()) {
    const f = new Fraction(v1);
    return f.pow(g).toFraction();
  } else {
    v1 = convertFracToDecimal(v1);
    v2 = convertFracToDecimal(v2);
    return new Fraction(v1.toPower(v2).toString());
  }
}

function fracPow10(v1, v2) {
  const f = new Fraction(v1);
  const g = new Fraction(v2);
  return f.mul(fracPow(10, g)).toString();
}

function fracFactorial(v1) {
  return 'syntax error';
}

//v is a string 'n/d'
function convertFracToDecimal(v) {
  const f = new Fraction(v);
  const vn = new Decimal(f.n);
  const vd = new Decimal(f.d);
  return vn.dividedBy(vd);
}
