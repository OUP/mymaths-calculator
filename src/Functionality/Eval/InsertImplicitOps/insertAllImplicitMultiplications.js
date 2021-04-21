import {
  insertImplicitOp,
  isInternalFraction,
  isInternalRoot,
  detectNumber,
  detectFunction
} from './implicitOpsUtilities';

export default function insertAllImplicitMultiplications(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectImplicitMultiplication(inputArray, i)) {
      inputArray = insertImplicitOp(inputArray, i, '×');
    }
  }
  return inputArray;
}

function detectImplicitMultiplication(inputArray, index) {
  return (
    twoMultiplicationTerms(inputArray, index) &&
    !isInternalFraction(inputArray, index) &&
    !isInternalRoot(inputArray, index)
  );
}

function twoMultiplicationTerms(inputArray, index) {
  return (
    detectMultiplicationTerm(inputArray[index]) &&
    detectMultiplicationTerm(inputArray[index + 1])
  );
}

function detectMultiplicationTerm(el) {
  return detectNumber(el) || detectFunction(el) || el === 'π';
}
