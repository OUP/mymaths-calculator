import buttonType from './ButtonType';
import { accurateOp, accurateFunc } from './AccurateMaths';
import { fractionOp } from './FractionOps';
import Decimal from 'decimal.js/decimal';
import {
  assembleArguments,
  assembleNumbers,
  checkIfFraction
} from './Utilities';
import { moreOpsToDo, findNextOp, opPriority } from './OrganiseOps';

//Do the calculation on pressing =
export function calcEval(inputValue, oldOutput = '0') {
  //Pass input array by value not by reference
  let outputArray = [];
  outputArray = inputValue.slice(0);

  outputArray = assembleNumbers(outputArray);
  outputArray = assembleArguments(outputArray);
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

  const outVal = outputArray[0].value;
  const outValStr = outVal.toString();
  if (!outValStr.includes('/')) {
    const decVal = new Decimal(outVal);
    return decVal.toString();
  } else {
    return outputArray[0].value.toString();
  }
}

function doNextOp(inputArray) {
  const nextOp = findNextOp(inputArray);
  console.log('nextOp.position', nextOp.position);
  const outputArray = executeOp(nextOp.array, nextOp.position);
  return outputArray;
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
