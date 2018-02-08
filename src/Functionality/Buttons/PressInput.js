import { splitInputAtCursor, cloneState } from './ButtonUtilities';
import { pressFunction } from './PressFunction';

export const pressInput = function recur(button, bType, currentState) {
  if (currentState.cursorPosition === -1) {
    if (currentState.storePosition === -1) {
      currentState.inputValue = [];
    }
    currentState.cursorPosition = currentState.inputValue.length;
  }

  const splitInput = splitInputAtCursor(currentState);

  //Recursion to get inside brackets
  const funcArg = splitInput.arg;
  if (funcArg && button !== ')') {
    const funcState = cloneState(currentState);
    funcState.inputValue = funcArg;
    funcState.cursorPosition = funcArg.length;
    const newFuncArg = recur(button, bType, funcState).inputValue;
    splitInput.start[currentState.cursorPosition - 1].argument = newFuncArg;
    currentState.inputValue = splitInput.start.concat(splitInput.end);
    return currentState;
  }

  currentState.inputValue = splitInput.start;

  switch (bType) {
    case 'function':
      pressFunction(button, currentState);
      break;

    default:
      pressButton(button, currentState);
      break;
  }

  currentState.inputValue = currentState.inputValue.concat(splitInput.end);
  currentState.cursorPosition = currentState.cursorPosition;
  return currentState;
};

function pressButton(button, currentState) {
  currentState.inputValue.push(button.toString());
  currentState.cursorPosition++;
  return currentState;
}
