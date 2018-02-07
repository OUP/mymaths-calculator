import { splitInputAtCursor, cloneState } from './ButtonUtilities';

export const pressDel = function recur(currentState) {
  const splitInput = splitInputAtCursor(currentState);

  //Recursion to get inside brackets
  const funcArg = splitInput.arg;
  if (funcArg) {
    if (funcArg.length) {
      const funcState = cloneState(currentState);
      funcState.inputValue = funcArg;
      funcState.cursorPosition = funcArg.length;
      const newFuncArg = recur(funcState).inputValue;
      splitInput.start[currentState.cursorPosition - 1].argument = newFuncArg;
      currentState.inputValue = splitInput.start.concat(splitInput.end);
      return currentState;
    }
  }

  currentState.inputValue = splitInput.start;
  currentState.inputValue.pop();
  currentState.inputValue = currentState.inputValue.concat(splitInput.end);
  if (currentState.cursorPosition > 0) {
    currentState.cursorPosition--;
  }
  return currentState;
};
