export default function insertImplicitOps(inputArray) {
  inputArray = insertAllImplicitAdditions(inputArray);
  inputArray = insertAllImplicitMultiplications(inputArray);
  return inputArray;
}

function insertAllImplicitAdditions(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectImplicitAddition(inputArray, i)) {
      inputArray = insertImplicitOp(inputArray, i, 'mixedFraction');
    }
  }
  return inputArray;
}

function insertAllImplicitMultiplications(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectImplicitMultiplication(inputArray, i)) {
      inputArray = insertImplicitOp(inputArray, i, '×');
    }
  }
  return inputArray;
}

function detectImplicitAddition(inputArray, index) {
  return isMixedInternalFraction(inputArray, index);
}

function detectImplicitMultiplication(inputArray, index) {
  return (
    twoMultiplicationTerms(inputArray, index) &&
    !isInternalFraction(inputArray, index)
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

function isInternalFraction(inputArray, index) {
  return (
    isUnmixedInternalFraction(inputArray, index) ||
    isMixedInternalFraction(inputArray, index)
  );
}

function isUnmixedInternalFraction(inputArray, index) {
  return (
    detectNumerator(inputArray[index]) &&
    detectDenominator(inputArray[index + 1])
  );
}

function isMixedInternalFraction(inputArray, index) {
  return (
    detectNumber(inputArray[index]) && detectNumerator(inputArray[index + 1])
  );
}

function insertImplicitOp(inputArray, index, op) {
  inputArray.splice(index + 1, 0, op);
  return inputArray;
}

function detectNumber(possibleNumber) {
  return possibleNumber === parseFloat(possibleNumber).toString();
}

function detectFunction(possibleMultiplicand) {
  return (
    possibleMultiplicand.function && possibleMultiplicand.function !== 'xⁿ'
  );
  // existence of type property indicates a function
}

function detectNumerator(possibleFraction) {
  return detectFraction(possibleFraction, 'numerator');
}

function detectDenominator(possibleFraction) {
  return detectFraction(possibleFraction, 'denominator');
}

function detectFraction(possibleFraction, fractionPart) {
  return (
    possibleFraction.function && possibleFraction.function === fractionPart
  );
}
