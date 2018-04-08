import { accurateOp } from './AccurateMaths';
import { fractionOp } from './FractionOps';
import { checkIfFraction } from '../Utilities';

export function numericOp(valBefore, operation, valAfter) {
  if (!checkIfFraction(valBefore) && !checkIfFraction(valAfter)) {
    return doDecimalOp(valBefore, operation, valAfter);
  } else {
    return doFractionOp(valBefore, operation, valAfter);
  }
}

function doDecimalOp(valBefore, operation, valAfter) {
  const numBefore = parseFloat(valBefore);
  let numAfter = 0;
  if (valAfter) {
    numAfter = parseFloat(valAfter);
  }
  return accurateOp(numBefore, operation, numAfter);
}

function doFractionOp(valBefore, operation, valAfter) {
  return fractionOp(valBefore, operation, valAfter);
}
