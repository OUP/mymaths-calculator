import { splitInputAtCursor } from './ButtonUtilities';
import { pressFunction } from './PressFunction';

export const pressInput = function recur(button, bType, currentState) {
  if (currentState.cursorPosition === -1) {
    if (currentState.storePosition === -1) {
      currentState.inputValue = [];
    }
    currentState.cursorPosition = currentState.inputValue.length;
  }

  const splitInput = splitInputAtCursor(currentState);
  currentState.inputValue = splitInput.start;

  switch (bType) {
    case 'function':
      pressFunction(button, currentState);
      switch (button) {
        case '√(x)':
          currentState.inputValue.push('cArg' + currentState.functionKey);
          break;

        default:
          break;
      }
      break;

    default:
      pressButton(button, currentState);
      break;
  }

  currentState.inputValue = currentState.inputValue.concat(splitInput.end);
  currentState.cursorPosition = currentState.cursorPosition;
  currentState.shift = false;
  return currentState;
};

function pressButton(button, currentState) {
  currentState.inputValue.push(button.toString());
  currentState.cursorPosition++;
  return currentState;
}
