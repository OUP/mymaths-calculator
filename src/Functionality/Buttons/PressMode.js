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
        const func = safeGetFunction(
          currentState.inputValue,
          currentState.cursorPosition
        );
        if (hasInaccessibleChar(func)) {
          pressMode('⬅', currentState);
        }
      } else {
        currentState.cursorPosition = currentState.inputValue.length;
      }
      break;

    case '➡':
      if (currentState.cursorPosition < currentState.inputValue.length) {
        currentState.cursorPosition++;
        const func = safeGetFunction(
          currentState.inputValue,
          currentState.cursorPosition
        );
        if (hasInaccessibleChar(func)) {
          pressMode('➡', currentState);
        }
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

function safeGetFunction(arr, index) {
  if (arr) {
    if (arr[index]) {
      const func = arr[index].function;
      if (func) {
        return func;
      }
    }
  }
  return false;
}

function hasInaccessibleChar(func) {
  return (
    func === 'numerator' ||
    func === 'denominator' ||
    func === 'base' ||
    func === 'root' ||
    func === 'rootBase'
  );
}
