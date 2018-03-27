import Decimal from 'decimal.js/decimal';
const Fraction = require('fraction.js');
import buttonType from './ButtonType';

export function assembleNumbers(outputArray) {
  const updatedArray = cloneState(outputArray);
  for (let i = 0; i < updatedArray.length; i++) {
    if (buttonType(updatedArray[i]) === 'number') {
      if (buttonType(updatedArray[i + 1]) === 'number') {
        updatedArray.splice(i, 2, updatedArray[i] + updatedArray[i + 1]);
        i--;
      }
    }
  }
  return updatedArray;
}

export const assembleArguments = function recur(outputArray) {
  let recursionNeeded = false;
  const arrFromPrevIteration = cloneState(outputArray);
  for (let i = 0; i < outputArray.length; i++) {
    if (safeArgCheck(outputArray, i)) {
      if (!safeArgCheck(outputArray, i + 1)) {
        if (outputArray[i + 1]) {
          const updatedFunc = cloneState(outputArray[i]);
          if (checkToAdd(outputArray, i + 1)) {
            updatedFunc.argument.push(outputArray[i + 1]);
            outputArray.splice(i, 2, updatedFunc);
            i--;
          } else {
            updatedFunc.argument.push('cArg');
            outputArray.splice(i, 1, updatedFunc);
            i--;
          }
        }
      } else {
        recursionNeeded = true;
      }
    }
  }
  if (recursionNeeded && !identicalArrays(outputArray, arrFromPrevIteration)) {
    outputArray = recur(outputArray);
  }
  return outputArray;
};

function checkToAdd(outputArray, j) {
  const func = outputArray[j - 1];
  const key = safeGetKey(func);
  const possArgEl = outputArray[j];
  if (buttonType(possArgEl) === 'cArg' && possArgEl !== 'cArg' + key) {
    return false;
  } else {
    return true;
  }
}

function safeGetKey(possibleFunc) {
  if (possibleFunc) {
    const key = possibleFunc.key;
    if (key) {
      return key;
    }
  }
  return null;
}

//Check whether element at i has an open argument
export function safeArgCheck(outputArray, i) {
  if (outputArray[i]) {
    if (outputArray[i].argument) {
      if (
        !outputArray[i].argument.includes(')') &&
        !cArgCheck(outputArray[i].argument)
      ) {
        return true;
      }
    }
  }
  return false;
}

function cArgCheck(argArray) {
  if (argArray.length) {
    for (let i = 0; i < argArray.length; i++) {
      if (buttonType(argArray[i]) === 'cArg') {
        return true;
      }
    }
  } else {
    return false;
  }
  return false;
}

export function splitInputAtCursor(currentState) {
  const inputValue = currentState.inputValue;
  const cursorPosition = currentState.cursorPosition;
  const start = inputValue.slice(0, cursorPosition);
  const end = inputValue.slice(cursorPosition);
  let arg;

  //Deal with brackets etc.
  const lastElement = inputValue[cursorPosition - 1];
  if (lastElement) {
    if (lastElement.function) {
      arg = lastElement.argument;
    }
  } else {
    arg = false;
  }
  return { start: start, end: end, arg: arg };
}

export function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function identicalArrays(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

export function checkIfFraction(val) {
  //val can be undefined
  if (val) {
    return val.toString().includes('/');
  }
  return false;
}

export function checkForSymbols(val) {
  //val can be undefined
  if (val) {
    return val.toString().includes('π');
  }
  return false;
}

//v is a string 'n/d'
export function convertFracToDecimal(v) {
  const f = new Fraction(v);
  const vn = new Decimal(f.n);
  const vd = new Decimal(f.d);
  return vn.dividedBy(vd);
}

export function removeElement(array, index) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    i !== index ? newArray.push(array[i]) : newArray;
  }
  return newArray;
}

export function makeString(decOrFrac) {
  if (decOrFrac) {
    if (decOrFrac.toFraction) {
      if (decOrFrac.toFraction().constructor === String) {
        return decOrFrac.toFraction();
      }
    }
  }
  return decOrFrac.toString();
}
