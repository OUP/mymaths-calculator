import { splitInputAtCursor } from './ButtonUtilities';
import { buttonType } from '../ButtonType';

export const pressDel = function recur(currentState) {
  const splitInput = splitInputAtCursor(currentState);

  currentState.inputValue = splitInput.start;
  if (!cArgCheck(currentState)) {
    const deleted = currentState.inputValue.pop();
    currentState.inputValue = currentState.inputValue.concat(splitInput.end);
    if (safeCheckKey(deleted)) {
      destroyCArg(currentState, deleted.key);
    }
  }
  if (currentState.cursorPosition > 0) {
    currentState.cursorPosition--;
  }
  currentState.shift = false;
  return currentState;
};

function cArgCheck(currentState) {
  return (
    buttonType(currentState.inputValue[currentState.inputValue.length - 1]) ===
    'cArg'
  );
}

function safeCheckKey(el) {
  if (el) {
    if (el.key) {
      return true;
    }
  }
  return false;
}

function destroyCArg(currentState, functionKey) {
  currentState.inputValue = currentState.inputValue.filter(
    x => x !== 'cArg' + functionKey
  );
}
