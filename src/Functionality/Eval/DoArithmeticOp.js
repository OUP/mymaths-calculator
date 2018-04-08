import buttonType from '../ButtonType';
import { checkForSymbols } from '../Utilities';
import { opPriority } from './OrganiseOps';
import { symbolicOp } from './SymbolOps';
import { numericOp } from './NumericOp';
import { FractionExpression } from './Symbol';

export function doArithmeticOp(inputArray, position) {
  const operation = inputArray[position].value;
  const value = evalArithmeticOp(inputArray, position, operation);
  updateArrayFromOp(inputArray, position, operation, outputFactory(value));
  return;
}

function evalArithmeticOp(inputArray, position, operation) {
  const valBefore = inputArray[position - 1].value;
  let valAfter = '0';
  if (inputArray[position + 1]) {
    valAfter = inputArray[position + 1].value;
  }
  return opValue(valBefore, operation, valAfter);
}

function opValue(valBefore, operation, valAfter) {
  if (checkForSymbols(valBefore) || checkForSymbols(valAfter)) {
    return catchError(symbolicOp(valBefore, operation, valAfter));
  } else {
    return catchError(numericOp(valBefore, operation, valAfter));
  }
}

function updateArrayFromOp(inputArray, position, operation, output) {
  if (operation !== 'x!' && operation !== '%') {
    inputArray.splice(position - 1, 3, output);
  } else {
    inputArray.splice(position - 1, 2, output);
  }
}

function outputFactory(value) {
  if (value.constructor !== FractionExpression) {
    value = value.toString();
  }
  const output = { value: value, type: buttonType(value) };
  output.priority = opPriority(output);
  return output;
}

function catchError(value) {
  if (value === 'NaN' || typeof value === 'undefined' || value === 'error') {
    return ['error'];
  }
  return value;
}
