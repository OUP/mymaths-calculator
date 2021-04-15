import {
  insertImplicitOp,
  isMixedInternalFraction
} from './implicitOpsUtilities';

export default function insertAllImplicitAdditions(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectImplicitAddition(inputArray, i)) {
      inputArray = insertImplicitOp(inputArray, i, 'mixedFraction');
    }
  }
  return inputArray;
}

function detectImplicitAddition(inputArray, index) {
  return isMixedInternalFraction(inputArray, index);
}
