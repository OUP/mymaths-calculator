export function pressAC(currentState) {
  currentState.inputValue = [];
  currentState.outputValue = ['0'];
  currentState.cursorPosition = -1;
  currentState.storePosition = -1;
  currentState.shift = false;
  currentState.functionKey = 0;
  currentState.displayMode = 'fraction';
  return currentState;
}
