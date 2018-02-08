export function pressAC(currentState) {
  currentState.inputValue = [];
  currentState.outputValue = [];
  currentState.cursorPosition = -1;
  currentState.storePosition = -1;
  return currentState;
}
