export default function moveCursor(button, currentState) {
  switch (button) {
    case '⬅':
      moveCursorLeft(currentState);
      break;

    case '➡':
      moveCursorRight(currentState);
      break;
  }
  return;
}

function moveCursorLeft(currentState) {
  if (currentState.cursorPosition > 0) {
    currentState.cursorPosition--;
    const func = safeGetFunction(
      currentState.inputValue,
      currentState.cursorPosition
    );
    if (hasInaccessibleChar(func)) {
      moveCursorLeft(currentState);
    }
  } else {
    currentState.cursorPosition = currentState.inputValue.length;
  }
  return;
}

function moveCursorRight(currentState) {
  if (currentState.cursorPosition < currentState.inputValue.length) {
    currentState.cursorPosition++;
    const func = safeGetFunction(
      currentState.inputValue,
      currentState.cursorPosition
    );
    if (hasInaccessibleChar(func)) {
      moveCursorRight(currentState);
    }
  } else {
    currentState.cursorPosition = 0;
  }
  return;
}

function hasInaccessibleChar(func) {
  return (
    func === 'denominator' ||
    func === 'base' ||
    func === 'root' ||
    func === 'rootBase'
  );
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
