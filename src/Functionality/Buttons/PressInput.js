import { buttonReturn, splitInputAtCursor } from './ButtonUtilities';
import { pressNumber } from './PressNumber';
import { pressOperator } from './PressOperator';
import { pressAns } from './PressAns';
import { pressFunction } from './PressFunction';

export const pressInput = function recur(
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
