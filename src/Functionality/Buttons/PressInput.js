import { splitInputAtCursor } from '../Utilities';
import { pressFunction } from './PressFunction';

export const pressInput = function recur(button, bType, currentState) {
  if (currentState.cursorPosition === -1) {
    if (currentState.storePosition === -1) {
      currentState.inputValue = [];
    }
    currentState.cursorPosition = currentState.inputValue.length;
  }

  const splitInput = splitInputAtCursor(currentState);
  currentState.inputValue = splitInput.start;

  switch (bType) {
    case 'function':
    case 'sqrt':
      pressFunction(button, currentState);
      break;

    default:
      pressButton(button, currentState);
      break;
  }

  currentState.inputValue = currentState.inputValue.concat(splitInput.end);
  currentState.cursorPosition = currentState.cursorPosition;
  currentState.shift = false;
  return currentState;
};

function pressButton(button, currentState) {
  if (!isCompositeButton(button)) {
    currentState.inputValue.push(button.toString());
    currentState.cursorPosition++;
    return currentState;
  } else {
    return pressCompositeButton(button, currentState);
  }
}

function isCompositeButton(button) {
  switch (button) {
    case '×10ⁿ':
    case 'x²':
    case 'x³':
    case 'x⁻¹':
      return true;

    default:
      return false;
  }
}

function pressCompositeButton(button, currentState) {
  switch (button) {
    case '×10ⁿ':
      return pressPow10(currentState);

    case 'x²':
      return pressXSquared(currentState);

    case 'x³':
      return pressXCubed(currentState);

    case 'x⁻¹':
      return pressReciprocal(currentState);
  }
}

function pressPow10(currentState) {
  currentState = pressButton('×', currentState);
  currentState = pressButton('1', currentState);
  currentState = pressButton('0', currentState);
  return pressInput('xⁿ', 'operator', currentState);
}

function pressXSquared(currentState) {
  currentState = pressInput('xⁿ', 'operator', currentState);
  return pressInput('2', 'number', currentState);
}

function pressXCubed(currentState) {
  currentState = pressInput('xⁿ', 'operator', currentState);
  return pressInput('3', 'number', currentState);
}

function pressReciprocal(currentState) {
  currentState = pressInput('xⁿ', 'operator', currentState);
  currentState = pressInput('-', 'number', currentState);
  return pressInput('1', 'number', currentState);
}
