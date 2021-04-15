export function isInternalFraction(inputArray, index) {
  return (
    isUnmixedInternalFraction(inputArray, index) ||
    isMixedInternalFraction(inputArray, index)
  );
}

export function isUnmixedInternalFraction(inputArray, index) {
  return (
    detectNumerator(inputArray[index]) &&
    detectDenominator(inputArray[index + 1])
  );
}

export function isMixedInternalFraction(inputArray, index) {
  return (
    detectNumber(inputArray[index]) && detectNumerator(inputArray[index + 1])
  );
}

export function insertImplicitOp(inputArray, index, op) {
  inputArray.splice(index + 1, 0, op);
  return inputArray;
}

export function detectNumber(possibleNumber) {
  return possibleNumber === parseFloat(possibleNumber).toString();
}

export function detectFunction(possibleMultiplicand) {
  return (
    possibleMultiplicand.function && possibleMultiplicand.function !== 'xⁿ'
  );
  // existence of type property indicates a function
}

export function detectNumerator(possibleFraction) {
  return detectFraction(possibleFraction, 'numerator');
}

export function detectDenominator(possibleFraction) {
  return detectFraction(possibleFraction, 'denominator');
}

export function detectFraction(possibleFraction, fractionPart) {
  return (
    possibleFraction.function && possibleFraction.function === fractionPart
  );
}
