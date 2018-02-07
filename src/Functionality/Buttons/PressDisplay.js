export function pressDisplay(button, currentState) {
  switch (button) {
    case 'S⇔D':
      if (currentState.displayMode === 'fraction') {
        currentState.displayMode = 'decimal';
      } else {
        currentState.displayMode = 'fraction';
      }
      break;

    default:
      break;
  }
  return currentState;
}
