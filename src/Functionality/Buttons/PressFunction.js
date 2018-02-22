export function pressFunction(button, currentState) {
  const fType = funcType(button);

  switch (fType) {
    case 'argAfter':
      return pressArgAfter(button, currentState);

    case 'argBothSides':
      return pressArgBothSides(button, currentState);

    case ')':
      return pressCloseBracket(currentState);

    default:
      break;
  }
}

function funcType(button) {
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
    return 'argAfter';
  } else if (button === 'xⁿ' || button === 'frac') {
    return 'argBothSides';
  } else {
    return button;
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
    parts: 1,
    key: currentState.functionKey
    //Key used to destroy hidden characters that go with the function if the function is deleted
  });
  if (button === '√(x)') {
    currentState.inputValue.push('cArg' + currentState.functionKey);
  }

  if (button === '|x|') {
    currentState.inputValue.push('|');
  }
  return currentState;
}

function pressArgBothSides(button, currentState) {
  currentState.cursorPosition++;
  if (button === 'frac') {
    currentState.functionKey++;
    currentState.inputValue.push({
      type: 'function',
      function: 'numerator',
      argument: [],
      parts: 2,
      key: currentState.functionKey
      //Key used to destroy hidden characters that go with the function if the function is deleted
    });
    currentState.inputValue.push('cArg' + currentState.functionKey);
    currentState.inputValue.push({
      type: 'function',
      function: 'denominator',
      argument: [],
      key: currentState.functionKey
    });
    currentState.inputValue.push('cArg' + currentState.functionKey);
  } else if (button === 'xⁿ') {
    currentState.inputValue.push({
      type: 'function',
      function: 'base',
      argument: [],
      parts: 2,
      key: currentState.functionKey
      //Key used to destroy hidden characters that go with the function if the function is deleted
    });
    currentState.functionKey++;
    currentState.inputValue.push('cArg' + currentState.functionKey);
    currentState.inputValue.push({
      type: 'function',
      function: 'exponent',
      argument: [],
      key: currentState.functionKey
    });
    currentState.inputValue.push('cArg' + currentState.functionKey);
  }
  return currentState;
}
