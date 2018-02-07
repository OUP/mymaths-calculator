import { buttonReturn } from './ButtonUtilities';

export function pressMode(
  button,
  input,
  output,
  cursorPosition,
  storedInputs = [],
  storePosition = -1,
  shift
) {
  switch (button) {
    case 'shift':
      if (shift === false) {
        shift = true;
      } else {
        shift = false;
      }
      break;

    case '⬅':
      if (cursorPosition > 0) {
        cursorPosition--;
      } else {
        cursorPosition = input.length;
      }
      break;

    case '➡':
      if (cursorPosition < input.length) {
        cursorPosition++;
      } else {
        cursorPosition = 0;
      }
      break;

    case '⬆':
      if (storedInputs.length > 0 && cursorPosition < 0) {
        if (storePosition === -1) {
          storePosition = storedInputs.length - 2;
        } else if (storePosition > 0) {
          storePosition--;
        } else {
          storePosition = storedInputs.length - 1;
        }
        input = storedInputs[storePosition];
      }
      break;

    case '⬇':
      if (storedInputs.length > 0 && cursorPosition < 0) {
        if (storePosition < storedInputs.length - 1) {
          storePosition++;
        } else {
          storePosition = 0;
        }
        input = storedInputs[storePosition];
      }
      break;

    default:
      console.error(button + ' is WIP');
      break;
  }
  return buttonReturn(input, output, cursorPosition, storePosition, shift);
}
