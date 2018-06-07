import buttonType, { makeString } from '../ButtonType';
import Decimal from 'decimal.js/decimal';
import {
  assembleArguments,
  assembleNumbers,
  cloneState,
  checkForSymbols,
  checkIfFraction
} from '../Utilities';
import { moreOpsToDo, findNextOp } from './OrganiseOps';
import { doArithmeticOp } from './DoArithmeticOp';
import { accurateFunc } from './AccurateMaths';
import {
  SquareRoot,
  SqrtExpression,
  SqrtFractionExpression
} from '../Classes/Surd';
import { Term } from '../Classes/Symbol';

//Do the calculation on pressing =
export function calcEval(inputValue, oldOutput = '0') {
  if (inputValue.length === 0) {
    //Don't remove the old output if there's nothing to execute
    return oldOutput.toString();
  }
  inputValue = initOutputArray(inputValue);
  inputValue = replaceAns(inputValue, oldOutput);
  inputValue = assembleNumbers(inputValue);
  inputValue = assembleArguments(inputValue);
  inputValue = filterCloseBrackets(inputValue);
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

function handleEmptyOutput(inputArray) {
  if (!inputArray[0].value) {
    inputArray[0] = { value: inputArray[0] };
  }
  return;
}

function processValue(value) {
  //Decides between decimal and fraction and formats appropriately
  const valStr = makeString(value);
  if (!checkIfFraction(valStr) && !checkForSymbols(valStr)) {
    return new Decimal(valStr).toString();
  } else {
    switch (true) {
      case valStr.includes('√') && valStr === value:
        return squareRootFactory(valStr);

      case checkIfExpression(value):
        return processExpression(value);

      default:
        return value;
    }
  }
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

function squareRootFactory(str) {
  const numerator = new SqrtExpression([new SquareRoot(str)]);
  const one = new SqrtExpression([new Term('1')]);
  return new SqrtFractionExpression(numerator, one);
}

function checkIfExpression(value) {
  return (
    typeof value.numerator !== 'undefined' && value.denominator !== 'undefined'
  );
}

function processExpression(expression) {
  if (!expressionHasSymbols(expression)) {
    return calcEval([
      expression.numerator.terms[0].coefficient,
      '÷',
      expression.denominator.terms[0].coefficient
    ]);
  } else {
    return expression;
  }
}

function expressionHasSymbols({ numerator, denominator }) {
  return !(
    numerator.terms.length === 1 &&
    numerator.terms[0].symbols.length === 0 &&
    denominator.terms.length === 1 &&
    denominator.terms[0].symbols.length === 0
  );
}
