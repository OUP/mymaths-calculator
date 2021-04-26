import buttonType from '../ButtonType';
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
  currentState.mode = false;
  return currentState;
};

function pressButton(button, currentState) {
  currentState = needToInsertAns(button, currentState)
    ? insertAns(currentState)
    : currentState;

  return !isCompositeButton(button)
    ? pressNonCompositeButton(button, currentState)
    : pressCompositeButton(button, currentState);
}

function isCompositeButton(button) {
  switch (button) {
    case '×10ⁿ':
      return true;

    default:
      return false;
  }
}

function pressNonCompositeButton(button, currentState) {
  currentState.inputValue.push(button.toString());
  currentState.cursorPosition++;
  return currentState;
}

function pressCompositeButton(button, currentState) {
  switch (button) {
    case '×10ⁿ':
      return pressPow10(currentState);
  }
}

function pressPow10(currentState) {
  currentState = pressButton('×', currentState);
  currentState = pressButton('1', currentState);
  currentState = pressButton('0', currentState);
  return pressInput('xⁿ', 'function', currentState);
}

function needToInsertAns(button, currentState) {
  return (
    buttonType(button) === 'operator' && currentState.inputValue.length === 0
  );
}

function insertAns(currentState) {
  return pressButton('Ans', currentState);
}
