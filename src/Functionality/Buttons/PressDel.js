import { splitInputAtCursor, cloneState } from './ButtonUtilities';

export const pressDel = function recur(currentState) {
  const splitInput = splitInputAtCursor(currentState);

  currentState.inputValue = splitInput.start;
  currentState.inputValue.pop();
  currentState.inputValue = currentState.inputValue.concat(splitInput.end);
  if (currentState.cursorPosition > 0) {
    currentState.cursorPosition--;
  }
  return currentState;
};
