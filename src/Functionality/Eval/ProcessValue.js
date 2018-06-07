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
  if (!checkIfFraction(valStr) && !checkForSymbols(valStr)) {
    return new Decimal(valStr).toString();
  } else {
    switch (true) {
      case valStr.includes('√') && valStr === value:
        return squareRootFactory(valStr);

      case checkIfExpression(value):
        return processExpression(value);

      default:
        return value;
    }
  }
}

function squareRootFactory(str) {
  const numerator = new SqrtExpression([new SquareRoot(str)]);
  const one = new SqrtExpression([new Term('1')]);
  return new SqrtFractionExpression(numerator, one);
}

function checkIfExpression(value) {
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
