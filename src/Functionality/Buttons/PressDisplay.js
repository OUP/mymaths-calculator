export function pressDisplay(button, currentState) {
  switch (button) {
    case 'S⇔D':
      if (
        currentState.displayMode === 'fraction' ||
        currentState.displayMode === 'default'
      ) {
        currentState.displayMode = 'decimal';
      } else {
        currentState.displayMode = 'fraction';
      }
      break;

    default:
      break;
  }

  currentState.shift = false;
  return currentState;
}
