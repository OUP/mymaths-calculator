import Decimal from 'decimal.js/decimal';
import { checkIfFraction } from '../Utilities';
import { FractionExpression, Term, Expression } from '../Classes/Symbol';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';

export default function construct(x) {
  const defaultDenom = new Expression(new Term(1));
  switch (true) {
    case isString(x):
      return constructString(x, defaultDenom);

    case checkIfFraction(x):
    case isDecimal(x):
      return constructFracOrDec(x, defaultDenom);

    default:
      return x;
  }
}

function isString(possibleString) {
  return possibleString.constructor === String;
}

function isDecimal(possibleDecimal) {
  return possibleDecimal.constructor === Decimal;
}

function constructString(str, defaultDenom) {
  switch (true) {
    case isPiString(str):
      return constructPiString(defaultDenom);

    case isSqrtString(str):
      return constructSqrtString(str, defaultDenom);

    case isFractionString(str):
      return constructFractionString(str, defaultDenom);

    case isNumericStr(str):
      return constructDefaultString(str, defaultDenom);
  }
}

function constructFracOrDec(val, defaultDenom) {
  const term = new Term(val);
  const exp = new Expression([term]);
  return new FractionExpression(exp, defaultDenom);
}

function isPiString(str) {
  return str.includes('π');
}

function isSqrtString(str) {
  return str.includes('√');
}

function isFractionString(str) {
  return str.includes('/');
}

function isNumericStr(str) {
  return parseFloat(str).toString() === str;
}

function constructPiString(defaultDenom) {
  const term = new Term(1, ['π'], [1]);
  const exp = new Expression([term]);
  return new FractionExpression(exp, defaultDenom);
}

function constructSqrtString(str, defaultDenom) {
  const term = new SquareRoot(str);
  const exp = new SqrtExpression([term]);
  return new SqrtFractionExpression(exp, defaultDenom);
}

function constructFractionString(str, defaultDenom) {
  const term = new Term(str);
  const exp = new Expression([term]);
  return new FractionExpression(exp, defaultDenom).simplify();
}

function constructDefaultString(str, defaultDenom) {
  const term = new Term(parseFloat(str));
  const exp = new Expression([term]);
  return new FractionExpression(exp, defaultDenom);
}
