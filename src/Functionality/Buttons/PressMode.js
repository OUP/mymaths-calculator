import moveCursor from './moveCursor';

export function pressMode(button, currentState) {
  switch (button) {
    case 'shift':
    case 'mode':
      invertProperty(currentState, button);
      break;

    case '⬅':
    case '➡':
      moveCursor(button, currentState);
      break;

    case '⬆':
      if (
        currentState.storedInputs.length > 0 &&
        currentState.cursorPosition < 0
      ) {
        if (currentState.storePosition === -1) {
          if (currentState.storedInputs.length >= 2) {
            currentState.storePosition = currentState.storedInputs.length - 2;
          } else if (currentState.storedInputs.length === 1) {
            currentState.storePosition = 0;
          }
        } else if (currentState.storePosition > 0) {
          currentState.storePosition--;
        } else {
          currentState.storePosition = currentState.storedInputs.length - 1;
        }
        currentState.inputValue =
          currentState.storedInputs[currentState.storePosition];
      }
      break;

    case '⬇':
      if (
        currentState.storedInputs.length > 0 &&
        currentState.cursorPosition < 0
      ) {
        if (currentState.storePosition < currentState.storedInputs.length - 1) {
          currentState.storePosition++;
        } else {
          currentState.storePosition = 0;
        }
        currentState.inputValue =
          currentState.storedInputs[currentState.storePosition];
      }
      break;

    default:
      console.error(button + ' is WIP');
      break;
  }
  return currentState;
}

function invertProperty(currentState, property) {
  const currentValue = Boolean(currentState[property]);
  currentState[property] = !currentValue;
  return;
}
