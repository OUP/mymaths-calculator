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
    detectNumber(inputArray[index]) && detectMultiplicand(inputArray[index + 1])
  );
}

function insertImplicitMultiplication(inputArray, index) {
  inputArray.splice(index + 1, 0, '×');
  return inputArray;
  //return inputArray.splice(index, 0, '×');
}

function detectNumber(possibleNumber) {
  return possibleNumber === parseFloat(possibleNumber).toString();
}

function detectMultiplicand(possibleMultiplicand) {
  return Boolean(possibleMultiplicand.type);
  // existence of type property indicates a function
}
