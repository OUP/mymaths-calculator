export function buttonReturn(
  newInput,
  output,
  cursorPosition = 0,
  storePosition = -1,
  shift = false,
  displayMode = 'fraction'
) {
  if (output.constructor !== Array) {
    output = [output];
  }
  return {
    input: newInput,
    output: output,
    cursorPosition: cursorPosition,
    storePosition: storePosition,
    shift: shift,
    displayMode: displayMode
  };
}

export function splitInputAtCursor(input, cursorPosition) {
  const start = input.slice(0, cursorPosition);
  const end = input.slice(cursorPosition);
  let arg;

  //Deal with brackets etc.
  const lastElement = input[cursorPosition - 1];
  if (lastElement) {
    if (lastElement.function) {
      arg = lastElement.argument;
    }
  } else {
    arg = false;
  }
  return { start: start, end: end, arg: arg };
}
