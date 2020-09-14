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
  return (
    detectNumber(inputArray[index]) && detectFraction(inputArray[index + 1])
  );
}

function detectImplicitMultiplication(inputArray, index) {
  return (
    detectMultiplicationTerm(inputArray[index]) &&
    detectMultiplicationTerm(inputArray[index + 1])
  );
}

function detectMultiplicationTerm(el) {
  return detectNumber(el) || detectFunction(el) || el === 'π';
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
    possibleMultiplicand.function &&
    possibleMultiplicand.function !== 'numerator' &&
    possibleMultiplicand.function !== 'denominator'
  );
  // existence of type property indicates a function
}

function detectFraction(possibleFraction) {
  return possibleFraction.function && possibleFraction.function === 'numerator';
}
