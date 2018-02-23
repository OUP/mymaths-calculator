import { buttonType } from './ButtonType';
import { accurateOp, accurateFunc } from './AccurateMaths';
import { fractionOp } from './FractionOps';
import { cloneState, identicalArrays } from './Buttons/ButtonUtilities';

//Do the calculation on pressing =
export function calcEval(inputValue, oldOutput = '0') {
  //Pass input array by value not by reference
  let outputArray = [];
  outputArray = inputValue.slice(0);

  outputArray = assembleNumbers(outputArray);
  outputArray = assembleArguments(outputArray);
  outputArray = assemblePreArgs(outputArray);
  outputArray = replaceAns(outputArray, oldOutput);

  //Closed brackets are only used in organising the input, not to evaluate.
  outputArray = outputArray.filter(x => x !== ')');
  outputArray = outputArray.filter(x => x !== '|');
  outputArray = outputArray.filter(x => buttonType(x) !== 'cArg');
  outputArray = outputArray.filter(x => buttonType(x) !== 'oArg');

  while (moreOpsToDo(outputArray)) {
    outputArray = doNextOp(outputArray);
  }

  //Handle errors
  if (!outputArray[0]) {
    outputArray = new Array('0');
  }

  //Handle = press with empty input
  if (!outputArray[0].value) {
    outputArray[0] = { value: outputArray[0] };
  }

  //Don't remove the old output if there's nothing to execute
  if (outputArray.length === 0) {
    return oldOutput;
  }

  console.log('outVal', outputArray[0].value);
  return outputArray[0].value.toString();
}

function moreOpsToDo(inputArray) {
  if (inputArray.length > 1 || inputArray[0].argument) {
    return true;
  } else {
    return false;
  }
}

function replaceAns(inputArray, oldOutput) {
  const ansReplaced = inputArray;

  for (let i = 0; i < inputArray.length; i++) {
    if (ansReplaced[i] === 'Ans') {
      ansReplaced[i] = oldOutput[0];
    }
  }
  return ansReplaced;
}

function doNextOp(inputArray) {
  const nextOp = findNextOp(inputArray);
  console.log('nextOp.position', nextOp.position);
  const outputArray = executeOp(nextOp.array, nextOp.position);
  return outputArray;
}

function findNextOp(inputArray) {
  let prioritisedArray;

  //Skip prioritise ops if already prioritised
  if (!inputArray[0].priority && inputArray[0].priority !== 0) {
    prioritisedArray = prioritiseOps(inputArray);
  } else {
    prioritisedArray = inputArray;
  }

  const output = {};
  let i;
  let j;

  for (i = 1; i <= 6; i++) {
    for (j = 0; j < prioritisedArray.length; j++) {
      if (prioritisedArray[j].priority === i) {
        output.array = prioritisedArray;
        output.position = j;
        return output;
      }
    }
  }

  console.error('findNextOp expected an op.');
  return inputArray;
}

function executeOp(inputArray, position) {
  let output = {};
  const outputArray = inputArray;

  //Recursion to get inside brackets
  if (inputArray[position].value) {
    if (inputArray[position].value.argument) {
      console.log('found argument', inputArray[position].value.argument);
      output = {
        value: funcEval(inputArray, position).toString(),
        priority: 0,
        type: 'number'
      };
      outputArray.splice(position, inputArray[position].value.parts, output);

      //Catch infinite loops
      if (outputArray[position].value) {
        if (outputArray[position].value.argument) {
          console.error('recursion error');
          return {
            value: 'recursion error',
            priority: 0,
            type: 'number'
          };
        }
      }

      return outputArray;
    }
  }

  const operation = inputArray[position].value;
  const elBefore = inputArray[position - 1];
  const elAfter = inputArray[position + 1];
  let outputVal = 0;
  if (!checkIfFraction(elBefore) && !checkIfFraction(elAfter)) {
    const numBefore = parseFloat(inputArray[position - 1].value);
    let numAfter = 0;

    if (inputArray[position + 1]) {
      numAfter = parseFloat(inputArray[position + 1].value);
    }

    if (numBefore === '-' || numAfter === '-') {
      return ['syntax error'];
    }
    outputVal = accurateOp(numBefore, operation, numAfter);
    console.log('outputVal', outputVal);
  } else {
    const numBefore = inputArray[position - 1].value;
    let numAfter = 0;

    if (inputArray[position + 1]) {
      numAfter = inputArray[position + 1].value;
    }

    if (numBefore === '-' || numAfter === '-') {
      return ['syntax error'];
    }

    outputVal = fractionOp(numBefore, operation, numAfter);
  }

  output.value = outputVal.toString();

  if (output.value === 'NaN') {
    return ['syntax error'];
  }

  output.type = buttonType(output.value);
  output.priority = opPriority(output);
  if (
    operation !== 'x²' &&
    operation !== 'x!' &&
    operation !== 'x³' &&
    operation !== 'x⁻¹'
  ) {
    outputArray.splice(position - 1, 3, output);
  } else {
    outputArray.splice(position - 1, 2, output);
  }
  return outputArray;
}

function prioritiseOps(inputArray) {
  const prioritised = [];
  let element = {};
  let i;
  console.log(inputArray);
  for (i = 0; i < inputArray.length; i++) {
    element.value = inputArray[i];
    element.type = buttonType(inputArray[i]);
    element.priority = opPriority(element);
    prioritised.push(element);
    element = {};
  }
  return prioritised;
}

function opPriority(element) {
  if (element.type === 'function') {
    return 1;
  } else if (element.type !== 'operator') {
    return 0;
  } else {
    switch (element.value) {
      case 'xⁿ':
        return 2;

      case 'x²':
        return 2;

      case 'x³':
        return 2;

      case 'x⁻¹':
        return 2;

      case 'x!':
        return 2;
      //Strictly should be 4 but setting it to 2 is an auto-correct

      case '÷':
        return 3;

      case '×':
        return 4;

      case '×10ⁿ':
        return 4;

      case '–':
        return 5;

      case '+':
        return 6;

      default:
        console.error("Don't know the priority of " + element.value);
        break;
    }
  }
}

function funcEval(inputArray, funcIndex) {
  const inputEl = inputArray[funcIndex].value;
  const func = inputEl.function;
  console.log('inputEl.argument', inputEl.argument);
  const arg = calcEval(inputEl.argument);
  if (inputEl.parts === 2) {
    const inputEl2 = inputArray[funcIndex + 1].value;
    const arg2 = calcEval(inputEl2.argument);
    return accurateFunc(func, arg, arg2);
  } else {
    return accurateFunc(func, arg);
  }
}

function checkIfFraction(x) {
  //x can be undefined
  if (x) {
    return x.value.includes('/');
  } else {
    return false;
  }
}

export function assembleNumbers(outputArray) {
  const updatedArray = outputArray.slice(0);
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
  const arrFromPrevIteration = outputArray.slice(0);
  for (let i = 0; i < outputArray.length; i++) {
    if (safeArgCheck(outputArray, i)) {
      if (!safeArgCheck(outputArray, i + 1)) {
        if (outputArray[i + 1]) {
          const updatedFunc = cloneState(outputArray[i]);
          if (checkToAdd(outputArray, i + 1)) {
            updatedFunc.argument.push(outputArray[i + 1]);
            outputArray.splice(i, 2, updatedFunc);
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
  const possArgEl = outputArray[j];
  const testKey = safeGetKey(possArgEl);
  if (testKey) {
    const testArray = outputArray.slice(0, j);
    return !searchForOArg(testArray, testKey);
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

export const assemblePreArgs = function recur(outputArray) {
  let recursionNeeded = false;
  const arrFromPrevIteration = outputArray.slice(0);
  for (let i = outputArray.length - 1; i >= 0; i--) {
    if (safePreArgCheck(outputArray, i)) {
      if (!safePreArgCheck(outputArray, i - 1)) {
        const key = outputArray[i].key;
        const updatedFunc = cloneState(outputArray[i]);
        updatedFunc.preArgument.unshift(outputArray[i - 1]);
        outputArray.splice(i - 1, 2, updatedFunc);
        if (!searchForOArg(outputArray, key)) {
          i--;
        }
      } else {
        recursionNeeded = true;
      }
    }
    if (
      recursionNeeded &&
      !identicalArrays(outputArray, arrFromPrevIteration)
    ) {
      outputArray = recur(outputArray);
    }
  }
  return outputArray;
};

function safePreArgCheck(outputArray, i) {
  if (outputArray[i]) {
    if (outputArray[i].preArgument) {
      const key = outputArray[i].key;
      if (
        (!oArgCheck(outputArray[i].preArgument) &&
          !outputArray[i].preArgument.length) ||
        searchForOArg(outputArray, key)
      ) {
        return true;
      }
    }
  }
  return false;
}

function oArgCheck(argArray) {
  if (argArray.length) {
    for (let i = 0; i < argArray.length; i++) {
      if (buttonType(argArray[i]) === 'oArg') {
        return true;
      }
    }
  }
  return false;
}

function searchForOArg(outputArray, key) {
  for (let i = 0; i < outputArray.length; i++) {
    if (outputArray[i] === 'oArg' + key) {
      return true;
    }
  }
  return false;
}
