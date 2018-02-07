import { buttonReturn } from './ButtonUtilities';

export function pressDisplay(
  button,
  currentInputValue,
  currentOutputValue,
  cursorPosition,
  storedInputs,
  storePosition,
  shift,
  displayMode
) {
  switch (button) {
    case 'S⇔D':
      if (displayMode === 'fraction') {
        displayMode = 'decimal';
      } else {
        displayMode = 'fraction';
      }
      break;

    default:
      break;
  }
  return buttonReturn(
    currentInputValue,
    currentOutputValue,
    cursorPosition,
    storePosition,
    shift,
    displayMode
  );
}
