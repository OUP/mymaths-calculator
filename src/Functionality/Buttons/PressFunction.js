export function pressFunction(button, currentState) {
  const fType = funcType(button);

  switch (fType) {
    case 'argAfter':
      return pressArgAfter(button, currentState);

    case 'argBothSides':
      return pressArgBothSides(button, currentState);

    case 'argIncluded':
      return pressArgIncluded(button, currentState);

    case ')':
      return pressCloseBracket(currentState);

    default:
      break;
  }
}

function funcType(button) {
  switch (button) {
    case '|x|':
    case 'log(x)':
    case 'ln(x)':
    case '√(x)':
    case '(':
    case 'sin(x)':
    case 'cos(x)':
    case 'tan(x)':
    case 'sin⁻¹':
    case 'cos⁻¹':
    case 'tan⁻¹':
    case 'xⁿ':
      return 'argAfter';

    case 'frac':
      return 'argBothSides';

    case 'x²':
    case 'x³':
    case 'x⁻¹':
      return 'argIncluded';

    default:
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
  if (button === '√(x)' || button === 'xⁿ') {
    currentState.inputValue.push('cArg' + currentState.functionKey);
  }

  return currentState;
}

function pressArgBothSides(button, currentState) {
  currentState.cursorPosition++;
  if (button === 'frac') {
    pressFrac(currentState);
  }
  return currentState;
}

function pressArgIncluded(button, currentState) {
  currentState.functionKey++;
  currentState.inputValue.push({
    type: 'function',
    function: noArg(button),
    argument: [],
    parts: 1,
    key: currentState.functionKey
    //Key used to destroy hidden characters that go with the function if the function is deleted
  });
  pushIncludedArg(currentState.inputValue, button);
  updateCursorPosition(currentState, button);
  currentState.inputValue.push('cArg' + currentState.functionKey);
  return currentState;
}

function pressFrac(currentState) {
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
  return;
}

function noArg(button) {
  switch (button) {
    case 'x²':
    case 'x³':
    case 'x⁻¹':
      return 'xⁿ';

    default:
      return button;
  }
}

function pushIncludedArg(inputArray, button) {
  switch (button) {
    case 'x²':
      inputArray.push('2');
      break;

    case 'x³':
      inputArray.push('3');
      break;

    case 'x⁻¹':
      inputArray.push('-', '1');
      break;

    default:
      break;
  }
  return;
}

function updateCursorPosition(currentState, button) {
  switch (button) {
    case 'x²':
    case 'x³':
      currentState.cursorPosition += 3;
      break;

    case 'x⁻¹':
      currentState.cursorPosition += 4;
      break;
  }
  return;
}
