import { buttonType } from './ButtonType';
import { robustOp, robustFunc } from './RobustMaths';

//Do the calculation on pressing =
export function calcEval(inputArray, oldOutput = '0') {
  //Pass input array by value not by reference
  let outputArray = [];
  outputArray = inputArray.slice(0);

  //Stitch together adjacent digits
  for (let i = 0; i < outputArray.length; i++) {
    if (buttonType(outputArray[i]) === 'number') {
      if (buttonType(outputArray[i + 1]) === 'number') {
        outputArray.splice(i, 2, outputArray[i] + outputArray[i + 1]);
        i--;
        console.log('outputArray', outputArray);
      }
    }
  }

  //Substitute in value for Ans
  outputArray = replaceAns(outputArray, oldOutput);

  //Closed brackets are only used in organising the input, not to evaluate.
  outputArray = outputArray.filter(x => x !== ')');
  outputArray = outputArray.filter(x => x !== '|');

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
      ansReplaced[i] = oldOutput;
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
    console.log('gen prioritisedArray', prioritisedArray);
  } else {
    prioritisedArray = inputArray;
    console.log('received prioritisedArray', prioritisedArray);
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
        value: funcEval(
          inputArray[position].value.function,
          inputArray[position].value.argument
        ).toString(),
        priority: 0,
        type: 'number'
      };
      outputArray.splice(position, 1, output);

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
  const numBefore = parseFloat(inputArray[position - 1].value);
  let numAfter = 0;

  if (inputArray[position + 1]) {
    numAfter = parseFloat(inputArray[position + 1].value);
  }

  if (numBefore === '-' || numAfter === '-') {
    return ['syntax error'];
  }
  const outputVal = robustOp(numBefore, operation, numAfter);
  output.value = outputVal.toString();

  if (output.value === 'NaN') {
    return ['syntax error'];
  }

  output.type = buttonType(output.value);
  output.priority = opPriority(output);
  outputArray.splice(position - 1, 3, output);
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

function funcEval(func, argument) {
  const argVal = calcEval(argument);
  return robustFunc(func, argVal);
}
