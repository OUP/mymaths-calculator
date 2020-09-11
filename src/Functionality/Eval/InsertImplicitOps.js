export default function insertImplicitOps(inputArray) {
  inputArray = insertAllImplicitMultiplications(inputArray);
  return inputArray;
}

function insertAllImplicitMultiplications(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectImplicitMultiplication(inputArray, i)) {
      inputArray = insertImplicitMultiplication(inputArray, i);
    }
  }
  return inputArray;
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

function insertImplicitMultiplication(inputArray, index) {
  inputArray.splice(index + 1, 0, '×');
  return inputArray;
}

function detectNumber(possibleNumber) {
  return possibleNumber === parseFloat(possibleNumber).toString();
}

function detectFunction(possibleMultiplicand) {
  return Boolean(possibleMultiplicand.type);
  // existence of type property indicates a function
}
