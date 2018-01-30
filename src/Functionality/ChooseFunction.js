export function pressFunction(button, input, cursorPosition) {
  let funcType = button;
  if(
    button === '|x|' ||
    button === 'log(x)' ||
    button === 'ln(x)' ||
    button === '√(x)' ||
    button === '(' ||
    button === 'sin(x)' ||
    button === 'cos(x)' ||
    button === 'tan(x)'
  ) {
    funcType = 'argAfter';
  }

  switch (funcType) {
    case 'argAfter':
    return pressArgAfter(button, input, cursorPosition);

    case ')':
    return pressCloseBracket(input, cursorPosition);

    default:
    break;
  }
}

function pressOpenBracket(input, cursorPosition) {
  let newInput = input;
  newInput.push({
    type: 'function',
    function: 'brackets',
    argument: []
  });
  cursorPosition++;
  return { newInput: newInput, newCursorPosition: cursorPosition };
}

function pressCloseBracket(input, cursorPosition) {
  let newInput = input;
  newInput.push(')');
  cursorPosition++;
  return { newInput: newInput, newCursorPosition: cursorPosition };
}

function pressArgAfter(button, input, cursorPosition) {
  let newInput = input;
  newInput.push({
    type: 'function',
    function: button,
    argument: []
  });
  cursorPosition++;

  if(button === '|x|') {
    newInput.push('|');
  }
  return { newInput: newInput, newCursorPosition: cursorPosition };
}
