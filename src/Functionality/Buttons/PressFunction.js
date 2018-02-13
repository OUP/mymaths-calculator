export function pressFunction(button, currentState) {
  let funcType = button;
  if (
    button === '|x|' ||
    button === 'log(x)' ||
    button === 'ln(x)' ||
    button === '√(x)' ||
    button === '(' ||
    button === 'sin(x)' ||
    button === 'cos(x)' ||
    button === 'tan(x)' ||
    button === 'sin⁻¹' ||
    button === 'cos⁻¹' ||
    button === 'tan⁻¹'
  ) {
    funcType = 'argAfter';
  }

  switch (funcType) {
    case 'argAfter':
      return pressArgAfter(button, currentState);

    case ')':
      return pressCloseBracket(currentState);

    default:
      break;
  }
}

function pressCloseBracket(currentState) {
  currentState.inputValue.push(')');
  currentState.cursorPosition++;
  return currentState;
}

function pressArgAfter(button, currentState) {
  currentState.cursorPosition++;
  currentState.functionKey++;
  currentState.inputValue.push({
    type: 'function',
    function: button,
    argument: [],
    key: currentState.functionKey
    //Key used to destroy hidden characters that go with the function if the function is deleted
  });

  if (button === '|x|') {
    currentState.inputValue.push('|');
  }
  return currentState;
}
