import { splitInputAtCursor } from '../Utilities';
import buttonType from '../ButtonType';

export const pressDel = function recur(currentState) {
  const splitInput = splitInputAtCursor(currentState);

  currentState.inputValue = splitInput.start;
  if (!hiddenCharCheck(currentState)) {
    const deleted = currentState.inputValue.pop();
    currentState.inputValue = currentState.inputValue.concat(splitInput.end);
    if (safeCheckKey(deleted)) {
      destroyHiddenChars(currentState, deleted.key);
    }
  }
  if (currentState.cursorPosition > 0) {
    currentState.cursorPosition--;
  }
  currentState.shift = false;
  return currentState;
};

function hiddenCharCheck(currentState) {
  return (
    buttonType(currentState.inputValue[currentState.inputValue.length - 1]) ===
      'cArg' ||
    buttonType(currentState.inputValue[currentState.inputValue.length - 1]) ===
      'oArg'
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

function destroyHiddenChars(currentState, functionKey) {
  currentState.inputValue = currentState.inputValue.filter(
    x => x !== 'cArg' + functionKey
  );
  currentState.inputValue = currentState.inputValue.filter(
    x => x !== 'oArg' + functionKey
  );
}
