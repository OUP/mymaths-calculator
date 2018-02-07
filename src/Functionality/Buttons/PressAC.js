export function pressAC(currentState) {
  currentState.inputValue = [];
  currentState.outputValue = [];
  currentState.cursorPosition = 0;
  currentState.storePosition = -1;
  return currentState;
}
