import buttonType from '../ButtonType';
import Decimal from 'decimal.js/decimal';
import { assembleArguments, assembleNumbers, cloneState } from '../Utilities';
import { moreOpsToDo, findNextOp } from './OrganiseOps';
import { doArithmeticOp } from './DoArithmeticOp';
import { accurateFunc } from './AccurateMaths';

//Do the calculation on pressing =
export function calcEval(inputValue, oldOutput = '0') {
  if (inputValue.length === 0) {
    //Don't remove the old output if there's nothing to execute
    return oldOutput.toString();
  }
  const outputArray = initOutputArray(inputValue);
  return processValue(getValue(outputArray, oldOutput));
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
  //Decides between decimal and fraction and formats appropriately
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
  return executeOp(nextOp.array, nextOp.position);
}

function executeOp(inputArray, position) {
  if (checkFunctionOp(inputArray[position])) {
    doFunction(inputArray, position);
  } else {
    doArithmeticOp(inputArray, position);
  }
  return inputArray;
}

function handleEmptyOutput(inputArray) {
  if (!inputArray[0].value) {
    inputArray[0] = { value: inputArray[0] };
  }
  return;
}

function checkFunctionOp(opEl) {
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
    value: funcEval(inputArray, position),
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
    return accurateFunc(func, arg, arg2).toString();
  } else {
    return accurateFunc(func, arg).toString();
  }
}
