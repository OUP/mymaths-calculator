export function pressFunction(button, currentState) {
  const fType = funcType(button);

  switch (fType) {
    case 'argAfter':
      return pressArgAfter(button, currentState);

    case 'argBothSides':
      return pressArgBothSides(button, currentState);

    case 'argIncluded':
      return pressArgIncluded(button, currentState);

    case 'twoArgs':
      return pressTwoArgs(button, currentState);

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
    case 'eⁿ':
      return 'argAfter';

    case 'frac':
      return 'argBothSides';

    case 'logₐ(x)':
      return 'twoArgs';

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
  return;
}

function pressArgAfter(button, currentState) {
  currentState.cursorPosition++;
  currentState.functionKey++;
  const inputValue = currentState.inputValue;
  inputValue.push(funcButtonFactory(button, currentState.functionKey));
  if (button === '√(x)' || button === 'xⁿ' || button === 'eⁿ') {
    inputValue.push('cArg' + currentState.functionKey);
  }
  return;
}

function pressArgBothSides(button, currentState) {
  currentState.cursorPosition++;
  if (button === 'frac') {
    pressFrac(currentState);
  }
  return;
}

function pressArgIncluded(button, currentState) {
  currentState.functionKey++;
  const inputValue = currentState.inputValue;
  inputValue.push(funcButtonFactory(noArg(button), currentState.functionKey));
  pushIncludedArg(inputValue, button);
  updateCursorPosition(currentState, button);
  inputValue.push('cArg' + currentState.functionKey);
  return;
}

function pressTwoArgs(button, currentState) {
  currentState.cursorPosition++;
  currentState.functionKey++;
  const inputValue = currentState.inputValue;
  inputValue.push(funcButtonFactory(button, currentState.functionKey));
  inputValue.push('cArg' + currentState.functionKey);
  inputValue.push(funcButtonFactory('(', currentState.functionKey));
  inputValue.push(')');
}

function pressFrac(currentState) {
  currentState.functionKey++;
  const inputValue = currentState.inputValue;
  inputValue.push(funcButtonFactory('numerator', currentState.functionKey));
  inputValue.push('cArg' + currentState.functionKey);
  inputValue.push(funcButtonFactory('denominator', currentState.functionKey));
  inputValue.push('cArg' + currentState.functionKey);
  return;
}

function funcButtonFactory(func, functionKey) {
  return {
    type: 'function',
    function: func,
    argument: [],
    parts: funcParts(func),
    key: functionKey
    //key used to destroy hidden characters that go with the function if the function is deleted
  };
}

function funcParts(func) {
  switch (func) {
    case 'numerator':
    case 'logₐ(x)':
      return 2;

    default:
      return 1;
  }
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
