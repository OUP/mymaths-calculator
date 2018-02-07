import { buttonType } from '../ButtonType';
import { pressOperator } from './PressOperator';

export function pressNumber(button, input, cursorPosition) {
  const newInput = input;
  const lastBType = buttonType(input[cursorPosition - 1]);

  if (button === '(-)') {
    if (lastBType === 'number') {
      return pressOperator('–', input, cursorPosition);
    } else {
      button = '-';
    }
  }

  newInput.push(button.toString());
  cursorPosition++;

  return { newInput: newInput, newCursorPosition: cursorPosition };
}
