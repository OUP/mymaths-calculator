import Decimal from 'decimal.js/decimal';
import { makeString } from '../ButtonType';
import { checkForSymbols, checkIfFraction } from '../Utilities';
import { numericOp } from './NumericOp';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';
import { Term } from '../Classes/Symbol';

export default function processValue(value) {
  //Decides between decimal and fraction and formats appropriately
  const valStr = makeString(value);

  switch (true) {
    case isNumber(valStr):
      return processNumber(valStr);

    case isSqrt(valStr, value):
      return processSquareRoot(valStr);

    case isExpression(value):
      return processExpression(value);

    default:
      return value;
  }
}

function isNumber(valStr) {
  return !checkIfFraction(valStr) && !checkForSymbols(valStr);
}

function processNumber(valStr) {
  return new Decimal(valStr).toString();
}

function isSqrt(valStr, value) {
  return valStr.includes('√') && valStr === value;
}

function processSquareRoot(str) {
  const numerator = new SqrtExpression([new SquareRoot(str)]);
  const one = new SqrtExpression([new Term('1')]);
  return new SqrtFractionExpression(numerator, one);
}

function isExpression(value) {
  return (
    typeof value.numerator !== 'undefined' && value.denominator !== 'undefined'
  );
}

function processExpression(expression) {
  if (!expressionHasSymbols(expression)) {
    return numericOp(
      expression.numerator.terms[0].coefficient,
      '÷',
      expression.denominator.terms[0].coefficient
    );
  } else {
    return expression;
  }
}

function expressionHasSymbols({ numerator, denominator }) {
  return !(
    numerator.terms.length === 1 &&
    numerator.terms[0].symbols.length === 0 &&
    denominator.terms.length === 1 &&
    denominator.terms[0].symbols.length === 0
  );
}
