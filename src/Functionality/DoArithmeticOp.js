import buttonType from './ButtonType';
import { accurateOp } from './AccurateMaths';
import { fractionOp } from './FractionOps';
import { checkIfFraction } from './Utilities';
import { opPriority } from './OrganiseOps';

export function doArithmeticOp(inputArray, position) {
  const operation = inputArray[position].value;
  const value = evalArithmeticOp(inputArray, position, operation);
  updateArrayFromOp(inputArray, position, operation, outputFactory(value));
  return;
}

function evalArithmeticOp(inputArray, position, operation) {
  const valBefore = inputArray[position - 1].value;
  const valAfter = inputArray[position + 1].value;
  if (!checkIfFraction(valBefore) && !checkIfFraction(valAfter)) {
    return doDecimalOp(valBefore, operation, valAfter);
  } else {
    console.log('got here', valBefore, valAfter);
    return doFractionOp(valBefore, operation, valAfter);
  }
}

function updateArrayFromOp(inputArray, position, operation, output) {
  if (
    operation !== 'x²' &&
    operation !== 'x!' &&
    operation !== 'x³' &&
    operation !== 'x⁻¹'
  ) {
    inputArray.splice(position - 1, 3, output);
  } else {
    inputArray.splice(position - 1, 2, output);
  }
}

function outputFactory(value) {
  const output = { value: value.toString(), type: buttonType(value) };
  output.priority = opPriority(output);
  return output;
}

function doDecimalOp(valBefore, operation, valAfter) {
  const numBefore = parseFloat(valBefore);
  let numAfter = 0;
  if (valAfter) {
    numAfter = parseFloat(valAfter);
  }
  return catchSyntaxError(accurateOp(numBefore, operation, numAfter));
}

function doFractionOp(valBefore, operation, valAfter) {
  return catchSyntaxError(fractionOp(valBefore, operation, valAfter));
}

function catchSyntaxError(value) {
  if (value === 'NaN') {
    return ['syntax error'];
  }
  return value;
}
