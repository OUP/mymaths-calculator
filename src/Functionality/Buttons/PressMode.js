export function pressMode(button, currentState) {
  switch (button) {
    case 'shift':
      if (currentState.shift === false) {
        currentState.shift = true;
      } else {
        currentState.shift = false;
      }
      break;

    case '⬅':
      if (currentState.cursorPosition > 0) {
        currentState.cursorPosition--;
      } else {
        currentState.cursorPosition = currentState.inputValue.length;
      }
      break;

    case '➡':
      if (currentState.cursorPosition < currentState.inputValue.length) {
        currentState.cursorPosition++;
      } else {
        currentState.cursorPosition = 0;
      }
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
