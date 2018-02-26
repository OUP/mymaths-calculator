import buttonType from './ButtonType';
import { accurateOp, accurateFunc } from './AccurateMaths';
import { fractionOp } from './FractionOps';
import Decimal from 'decimal.js/decimal';
import {
  assembleArguments,
  assembleNumbers,
  checkIfFraction,
  cloneState
} from './Utilities';
import { moreOpsToDo, findNextOp, opPriority } from './OrganiseOps';

//Do the calculation on pressing =
export function calcEval(inputValue, oldOutput = '0') {
  if (inputValue.length === 0) {
    //Don't remove the old output if there's nothing to execute
    return oldOutput.toString();
  }
  const outputArray = initOutputArray(inputValue);
  const value = getValue(outputArray, oldOutput);
  return processValue(value);
}

function initOutputArray(inputArray) {
  if (inputArray.length) {
    return cloneState(inputArray);
  }
  return [];
}

function getValue(inputArray, oldOutput) {
  inputArray = replaceAns(inputArray, oldOutput);
  inputArray = assembleNumbers(inputArray);
  inputArray = assembleArguments(inputArray);
  inputArray = filterCloseBrackets(inputArray);
  inputArray = doAllOps(inputArray);
  handleEmptyOutput(inputArray);
  return inputArray[0].value;
}

function processValue(value) {
  const valStr = value.toString();
  if (!valStr.includes('/')) {
    const decVal = new Decimal(value);
    return decVal.toString();
  } else {
    return valStr;
  }
}

function filterCloseBrackets(inputArray) {
  //Close brackets are used to organise ops, not to evaluate
  inputArray = inputArray.filter(x => x !== ')');
  inputArray = inputArray.filter(x => x !== '|');
  inputArray = inputArray.filter(x => buttonType(x) !== 'cArg');
  inputArray = inputArray.filter(x => buttonType(x) !== 'oArg');
  return inputArray;
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

function doAllOps(inputArray) {
  while (moreOpsToDo(inputArray)) {
    inputArray = doNextOp(inputArray);
  }
  return inputArray;
}

function doNextOp(inputArray) {
  const nextOp = findNextOp(inputArray);
  console.log('nextOp.position', nextOp.position);
  const outputArray = executeOp(nextOp.array, nextOp.position);
  return outputArray;
}

function executeOp(inputArray, position) {
  const output = {};
  const outputArray = inputArray;

  if (functionOp(outputArray[position])) {
    doFunction(outputArray, position);
    return outputArray;
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

function handleEmptyOutput(inputArray) {
  if (!inputArray[0].value) {
    inputArray[0] = { value: inputArray[0] };
  }
  return;
}

function functionOp(opEl) {
  if (opEl.value) {
    if (opEl.value.argument) {
      return true;
    }
  }
  return false;
}

function doFunction(inputArray, position) {
  console.log('found argument', inputArray[position].value.argument);
  const output = {
    value: funcEval(inputArray, position).toString(),
    priority: 0,
    type: 'number'
  };
  inputArray.splice(position, inputArray[position].value.parts, output);
  return;
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
