import { checkForSymbols } from '../../Utilities';

export default function handleNegativesWithSymbols(inputArray) {
  for (let i = 0; i < inputArray.length - 1; i++) {
    if (detectNegativeWithSymbol(inputArray, i)) {
      inputArray = replaceSymbolWithInverse(inputArray, i);
    }
  }
  return inputArray;
}

function detectNegativeWithSymbol(inputArray, i) {
  return inputArray[i] === '-' && isSymbolElement(inputArray[i + 1]);
}

function isSymbolElement(el) {
  return checkForSymbols(el) || isSqrt(el);
}

function isSqrt(el) {
  return (el.function && el.function === '√(x)') || el === '√';
}

function replaceSymbolWithInverse(inputArray, i) {
  inputArray.splice(i, 1, '-1', '×');
  return inputArray;
}
