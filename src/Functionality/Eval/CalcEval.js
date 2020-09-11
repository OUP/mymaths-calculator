import buttonType from '../ButtonType';
import { assembleArguments, assembleNumbers, cloneState } from '../Utilities';
import insertImplicitOps from './InsertImplicitOps';
import { moreOpsToDo, findNextOp } from './OrganiseOps';
import { doArithmeticOp } from './DoArithmeticOp';
import { accurateFunc } from './AccurateMaths';
import getRan from './GetRan';
import processValue from './ProcessValue';

//Do the calculation on pressing =
export function calcEval(inputValue, oldOutput = '0') {
  if (inputValue.length === 0) {
    //Don't remove the old output if there's nothing to execute
    return oldOutput.toString();
  }
  inputValue = initOutputArray(inputValue);
  inputValue = replaceAnsAndRan(inputValue, oldOutput);
  inputValue = assembleNumbers(inputValue);
  inputValue = assembleArguments(inputValue);
  inputValue = filterCloseBrackets(inputValue);
  inputValue = insertImplicitOps(inputValue);
  inputValue = doAllOps(inputValue);
  handleEmptyOutput(inputValue);
  return processValue(inputValue[0].value);
}

function initOutputArray(inputArray) {
  if (inputArray.length) {
    return cloneState(inputArray);
  }
  return [];
}

function filterCloseBrackets(inputArray) {
  //Close brackets are used to organise ops, not to evaluate
  inputArray = inputArray.filter(x => x !== ')');
  inputArray = inputArray.filter(x => x !== '|');
  inputArray = inputArray.filter(x => buttonType(x) !== 'cArg');
  inputArray = inputArray.filter(x => buttonType(x) !== 'oArg');
  return inputArray;
}

function replaceAnsAndRan(inputArray, oldOutput) {
  const replaced = inputArray;
  for (let i = 0; i < inputArray.length; i++) {
    if (replaced[i] === 'Ans') {
      replaced[i] = oldOutput[0];
    } else if (replaced[i] === 'Ran#') {
      replaced[i] = getRan();
    }
  }
  return replaced;
}

function doAllOps(inputArray) {
  while (moreOpsToDo(inputArray)) {
    inputArray = doNextOp(inputArray);
  }
  return inputArray;
}

function handleEmptyOutput(inputArray) {
  if (!inputArray[0].value) {
    inputArray[0] = { value: inputArray[0] };
  }
  return;
}

function doNextOp(inputArray) {
  const nextOp = findNextOp(inputArray);
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

function checkFunctionOp(opEl) {
  if (opEl.value) {
    if (opEl.value.argument) {
      return true;
    }
  }
  return false;
}

function doFunction(inputArray, position) {
  funcIsNotPow(inputArray[position].value.function)
    ? replaceFuncWithFuncVal(inputArray, position)
    : replacePowwithPowOperator(inputArray, position);
  return;
}

function replaceFuncWithFuncVal(inputArray, position) {
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
  const arg = calcEval(inputEl.argument);
  if (inputEl.parts === 2) {
    const inputEl2 = inputArray[funcIndex + 1].value;
    const arg2 = calcEval(inputEl2.argument);
    return accurateFunc(func, arg, arg2);
  } else {
    return accurateFunc(func, arg);
  }
}

function replacePowwithPowOperator(inputArray, position) {
  const power = {
    value: calcEval(inputArray[position].value.argument),
    priority: 0,
    type: 'number'
  };
  const func = inputArray[position].value.function;
  const op = {
    value: 'xⁿ',
    priority: 2,
    type: 'operator'
  };
  if (func === 'xⁿ') {
    inputArray.splice(position, 1, op, power);
  } else if (func === 'eⁿ') {
    const e = {
      value: Math.E,
      priority: 0,
      type: 'number'
    };
    inputArray.splice(position, 1, e, op, power);
  }
  return;
}

function funcIsNotPow(func) {
  return func !== 'xⁿ' && func !== 'eⁿ';
}
