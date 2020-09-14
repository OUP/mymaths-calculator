const Fraction = require('fraction.js');
import { convertFracToDecimal } from '../Utilities';

export function fractionOp(v1, operation, v2 = 0) {
  switch (operation) {
    case 'xⁿ':
      return fracPow(v1, v2);

    case 'x!':
      return fracFactorial(v1);

    case '%':
      return fracDivide(v1, '100');

    case '÷':
      return fracDivide(v1, v2);

    case '×':
      return fracMultiply(v1, v2);

    case '–':
      return fracSubtract(v1, v2);

    case '+':
    case 'mixedFraction':
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

function fracFactorial(v1) {
  return 'syntax error';
}
