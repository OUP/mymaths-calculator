import { buttonType } from './ButtonType';
import { buttonAction } from './ButtonAction';
import { parseToRender } from './ParseToRender';

export function updateState(context, button) {
  const buttonEffect = buttonAction(button, context.state);
  const type = buttonType(button);

  if (type !== 'display') {
    updateValues(context, buttonEffect);
  } else {
    updateDisplay(context, buttonEffect);
  }
}

export function initialiseState(context) {
  context.state = {
    shift: false,
    inputValue: [],
    inputStr: parseToRender([], 0),
    outputValue: [''],
    outputStr: '',
    cursorPosition: 0,
    storedInputs: [],
    storePosition: -1,
    displayMode: 'fraction',
    functionKey: 0 //Used for automatically destroying hidden characters
  };
}

function updateValues(context, buttonEffect) {
  updateShift(context, buttonEffect.shift);
  updateCursorPostion(context, buttonEffect.cursorPosition);
  updateInput(context, buttonEffect.inputValue, buttonEffect.cursorPosition);
  updateOutput(context, buttonEffect.outputValue, context.state.displayMode);
  updateStoredInputs(context, buttonEffect.storedInputs);
  updateStorePosition(context, buttonEffect.storePosition);
  updateFunctionKey(context, buttonEffect.functionKey);
}

function updateShift(context, shiftValue) {
  context.setState({
    shift: shiftValue
  });
}

function updateCursorPostion(context, cursorPosition) {
  context.setState({
    cursorPosition: cursorPosition
  });
}

function updateInput(context, inputValue, cursorPosition) {
  if (!identicalArrays(context.inputValue, inputValue)) {
    inputInvisible();
    context.setState({
      inputValue: inputValue,
      inputStr: parseToRender(inputValue, cursorPosition)
    });
    setTimeout(inputSlightlyVisible, 100);
    setTimeout(displayVisible, 200);
  }
}

function updateOutput(context, outputValue, displayMode) {
  if (!identicalArrays(context.outputValue, outputValue)) {
    context.setState({
      outputValue: outputValue,
      outputStr: parseToRender(outputValue, -1, displayMode)
    });
  }
}

function updateStoredInputs(context, storedInputs) {
  context.setState({
    storedInputs: storedInputs
  });
}

function updateStorePosition(context, storePosition) {
  context.setState({
    storePosition: storePosition
  });
}

function updateDisplay(context, buttonEffect) {
  context.setState({
    outputStr: parseToRender(
      buttonEffect.outputValue,
      -1,
      buttonEffect.displayMode
    ),
    displayMode: buttonEffect.displayMode
  });
}

function updateFunctionKey(context, functionKey) {
  context.setState({
    functionKey: functionKey
  });
}

function identicalArrays(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function inputInvisible() {
  document.getElementById('Input').style.visibility = 'hidden';
}

function outputInvisible() {
  document.getElementById('Output').style.visibility = 'hidden';
}

function inputSlightlyVisible() {
  document.getElementById('Input').style.visibility = 'visible';
  document.getElementById('Input').style.opacity = 0.1;
}

function displayVisible() {
  document.getElementById('Input').style.visibility = 'visible';
  document.getElementById('Output').style.visibility = 'visible';
  document.getElementById('Input').style.opacity = 1;
  document.getElementById('Output').style.opacity = 1;
}
