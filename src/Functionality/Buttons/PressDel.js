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
  const char = currentState.inputValue[currentState.inputValue.length - 1];
  const isHiddenChar = cOrO => buttonType(char) === hiddenChar(cOrO);
  return isHiddenChar('c') || isHiddenChar('o');
}

function safeCheckKey(el) {
  return el && el.key;
}

function destroyHiddenChars(currentState, functionKey) {
  const key = cOrO => hiddenChar(cOrO) + functionKey;
  currentState.inputValue = currentState.inputValue
    .filter(x => x !== key('c'))
    .filter(x => x !== key('o'));
}

function hiddenChar(cOrO) {
  return cOrO + 'Arg';
}
