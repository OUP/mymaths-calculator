import { buttonReturn, splitInputAtCursor } from './ButtonUtilities';

export const pressDel = function recur(input, output, cursorPosition) {
  const splitInput = splitInputAtCursor(input, cursorPosition);
  let newInput;

  //Recursion to get inside brackets
  const funcArg = splitInput.arg;
  if (funcArg) {
    if (funcArg.length) {
      const newFuncArg = recur(funcArg, output, funcArg.length).input;
      splitInput.start[cursorPosition - 1].argument = newFuncArg;
      newInput = splitInput.start.concat(splitInput.end);
      return buttonReturn(newInput, output, cursorPosition);
    }
  }

  newInput = splitInput.start;
  newInput.pop();
  newInput = newInput.concat(splitInput.end);
  if (cursorPosition > 0) {
    cursorPosition--;
  }
  return buttonReturn(newInput, output, cursorPosition);
};
