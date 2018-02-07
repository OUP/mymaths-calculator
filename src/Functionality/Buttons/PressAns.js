import { buttonType } from '../ButtonType';

export function pressAns(input, cursorPosition) {
  const newInput = input;

  //Put in implicit × if last input was a number
  const lastBType = buttonType(input[cursorPosition - 1]);
  if (lastBType === 'number') {
    newInput.push('×');
    cursorPosition++;
  }
  newInput.push('Ans');
  cursorPosition++;

  return { newInput: newInput, newCursorPosition: cursorPosition };
}
