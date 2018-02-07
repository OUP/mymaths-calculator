import { buttonType } from '../ButtonType';

export function pressOperator(button, input, cursorPosition) {
  let newInput = input;

  //Add in Ans if there are no numbers to operate on
  const lastBType = buttonType(input[cursorPosition - 1]);
  if (!lastBType) {
    newInput = ['Ans'];
    cursorPosition++;
  } else if (
    lastBType !== 'number' &&
    lastBType !== 'Ans' &&
    lastBType !== 'function'
  ) {
    newInput.push('Ans');
    cursorPosition++;
  }
  newInput.push(button);
  cursorPosition++;

  return { newInput: newInput, newCursorPosition: cursorPosition };
}
