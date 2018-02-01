import { buttonType } from './ButtonType';
import { calcEval } from './CalcEval';
import { pressFunction } from './ChooseFunction';

export function buttonAction(
  button,
  currentInputValue,
  currentOutputValue,
  cursorPosition,
  storedInputs = [],
  storePosition = -1
) {
  const bType = buttonType(button);
  let buttonOutput;

  //Store input and clear on first button input after pressing =
  if (cursorPosition === -1 && button !== '=' && bType !== 'mode') {
    if (currentInputValue !== []) {
      if (!storedInputs.length) {
        storedInputs.push(currentInputValue);
      } else if (storedInputs[storedInputs.length - 1] !== currentInputValue) {
        //Don't store if input is unchanged
        storedInputs.push(currentInputValue);
      }
    }
    currentInputValue = [];
    cursorPosition = 0;
  } else if (storePosition === -1 && (button === '⬆' || button === '⬇')) {
    storedInputs.push(currentInputValue);
  }

  //Additional layer on buttonTypes
  let bSuperType;
  if (
    bType === 'number' ||
    bType === 'operator' ||
    bType === 'Ans' ||
    bType === 'function'
  ) {
    bSuperType = 'input';
  } else {
    bSuperType = bType;
  }

  switch (bSuperType) {
    case 'input':
      buttonOutput = pressInputButton(
        button,
        bType,
        currentInputValue,
        currentOutputValue,
        cursorPosition
      );
      break;

    case '=':
      buttonOutput = pressEquals(currentInputValue, currentOutputValue);
      break;

    case 'DEL':
      buttonOutput = pressDel(
        currentInputValue,
        currentOutputValue,
        cursorPosition
      );
      break;

    case 'AC':
      buttonOutput = pressAC();
      break;

    case 'mode':
      buttonOutput = pressMode(
        button,
        currentInputValue,
        currentOutputValue,
        cursorPosition,
        storedInputs,
        storePosition
      );
      break;

    default:
      console.error('Unhandled button press.');
      break;
  }

  buttonOutput.storedInputs = storedInputs;
  return buttonOutput;
}

const pressInputButton = function recur(
  button,
  bType,
  input,
  output,
  cursorPosition
) {
  const splitInput = splitInputAtCursor(input, cursorPosition);
  let buttonOutput;
  let newInput;

  //Recursion to get inside brackets
  const funcArg = splitInput.arg;
  if (funcArg && button !== ')') {
    const newFuncArg = recur(button, bType, funcArg, output, funcArg.length)
      .input;
    splitInput.start[cursorPosition - 1].argument = newFuncArg;
    newInput = splitInput.start.concat(splitInput.end);
    return buttonReturn(newInput, output, cursorPosition);
  }

  switch (bType) {
    case 'number':
      buttonOutput = pressNumber(button, splitInput.start, cursorPosition);
      break;

    case 'operator':
      buttonOutput = pressOperator(button, splitInput.start, cursorPosition);
      break;

    case 'Ans':
      buttonOutput = pressAns(splitInput.start, cursorPosition);
      break;

    case 'function':
      buttonOutput = pressFunction(button, splitInput.start, cursorPosition);
      break;

    default:
      console.error(bType + ' not defined correctly.');
      break;
  }

  newInput = buttonOutput.newInput.concat(splitInput.end);
  return buttonReturn(newInput, output, buttonOutput.newCursorPosition);
};

function splitInputAtCursor(input, cursorPosition) {
  const start = input.slice(0, cursorPosition);
  const end = input.slice(cursorPosition);
  let arg;

  //Deal with brackets etc.
  const lastElement = input[cursorPosition - 1];
  if (lastElement) {
    if (lastElement.function) {
      arg = lastElement.argument;
    }
  } else {
    arg = false;
  }
  return { start: start, end: end, arg: arg };
}

function buttonReturn(
  newInput,
  output,
  cursorPosition = 0,
  storePosition = -1
) {
  if (output.constructor !== Array) {
    output = [output];
  }
  return {
    input: newInput,
    output: output,
    cursorPosition: cursorPosition,
    storePosition: storePosition
  };
}

function pressNumber(button, input, cursorPosition) {
  const newInput = input;
  const lastBType = buttonType(input[cursorPosition - 1]);

  if (button === '(-)') {
    if (lastBType === 'number') {
      return pressOperator('–', input, cursorPosition);
    } else {
      button = '-';
    }
  }

  newInput.push(button.toString());
  cursorPosition++;

  return { newInput: newInput, newCursorPosition: cursorPosition };
}

function pressOperator(button, input, cursorPosition) {
  let newInput = input;

  //Add in Ans if there are no numbers to operate on
  const lastBType = buttonType(input[cursorPosition - 1]);
  if (!lastBType) {
    newInput = ['Ans'];
    cursorPosition++;
  } else if (
    lastBType !== 'number' &&
    lastBType !== 'Ans' &&
    lastBType !== 'function'
  ) {
    newInput.push('Ans');
    cursorPosition++;
  }
  newInput.push(button);
  cursorPosition++;

  return { newInput: newInput, newCursorPosition: cursorPosition };
}

function pressAns(input, cursorPosition) {
  const newInput = input;

  //Put in implicit × if last input was a number
  const lastBType = buttonType(input[cursorPosition - 1]);
  if (lastBType === 'number') {
    newInput.push('×');
    cursorPosition++;
  }
  newInput.push('Ans');
  cursorPosition++;

  return { newInput: newInput, newCursorPosition: cursorPosition };
}

function pressEquals(input, output) {
  return buttonReturn(input, calcEval(input, output), -1);
}

const pressDel = function recur(input, output, cursorPosition) {
  const splitInput = splitInputAtCursor(input, cursorPosition);
  let newInput;

  //Recursion to get inside brackets
  const funcArg = splitInput.arg;
  if (funcArg) {
    if (funcArg.length) {
      const newFuncArg = recur(funcArg, output, funcArg.length).input;
      splitInput.start[cursorPosition - 1].argument = newFuncArg;
      newInput = splitInput.start.concat(splitInput.end);
      return buttonReturn(newInput, output, cursorPosition);
    }
  }

  newInput = splitInput.start;
  newInput.pop();
  newInput = newInput.concat(splitInput.end);
  if (cursorPosition > 0) {
    cursorPosition--;
  }
  return buttonReturn(newInput, output, cursorPosition);
};

function pressAC() {
  return buttonReturn([], '0');
}

//pressFunction has its own js file

function pressMode(
  button,
  input,
  output,
  cursorPosition,
  storedInputs = [],
  storePosition = -1
) {
  switch (button) {
    case '⬅':
      if (cursorPosition > 0) {
        cursorPosition--;
      } else {
        cursorPosition = input.length;
      }
      break;

    case '➡':
      if (cursorPosition < input.length) {
        cursorPosition++;
      } else {
        cursorPosition = 0;
      }
      break;

    case '⬆':
      if (storedInputs.length > 0 && cursorPosition < 0) {
        if (storePosition === -1) {
          storePosition = storedInputs.length - 2;
        } else if (storePosition > 0) {
          storePosition--;
        } else {
          storePosition = storedInputs.length - 1;
        }
        input = storedInputs[storePosition];
      }
      break;

    case '⬇':
      if (storedInputs.length > 0 && cursorPosition < 0) {
        if (storePosition < storedInputs.length - 1) {
          storePosition++;
        } else {
          storePosition = 0;
        }
        input = storedInputs[storePosition];
      }
      break;

    default:
      console.error(button + ' is WIP');
      break;
    //TODO: shift, ⬆ and ⬇
  }
  return buttonReturn(input, output, cursorPosition, storePosition);
}
