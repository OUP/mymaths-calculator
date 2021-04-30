import { checkForSymbols } from '../../Utilities';

export default function handleUnaryNegatives(inputArray) {
  inputArray = handleNegativesWithSymbols(inputArray);
  inputArray = handleNegativesWithFunctions(inputArray);
  return inputArray;
}

function handleNegativesWith(inputArray, detectionFunction) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectionFunction(inputArray, i)) {
      inputArray = replaceSymbolWithInverse(inputArray, i);
    }
  }
  return inputArray;
}

function handleNegativesWithSymbols(inputArray) {
  return handleNegativesWith(inputArray, detectNegativeWithSymbol);
}

function handleNegativesWithFunctions(inputArray) {
  return handleNegativesWith(inputArray, detectNegativeWithFunction);
}

function detectNegativeWithSymbol(inputArray, i) {
  return inputArray[i] === '-' && isSymbolElement(inputArray[i + 1]);
}

function detectNegativeWithFunction(inputArray, i) {
  return inputArray[i] === '-' && isFunctionElement(inputArray[i + 1]);
}

function isSymbolElement(el) {
  return checkForSymbols(el) || isSqrt(el);
}

function isSqrt(el) {
  return (el.function && el.function === '√(x)') || el === '√';
}

function isFunctionElement(el) {
  return Boolean(el.function);
}

function replaceSymbolWithInverse(inputArray, i) {
  inputArray.splice(i, 1, '-1', '×');
  return inputArray;
}
