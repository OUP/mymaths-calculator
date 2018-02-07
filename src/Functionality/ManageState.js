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
    inputStr: '¦',
    outputValue: ['0'],
    outputStr: '0',
    cursorPosition: 0,
    storedInputs: [],
    storePosition: -1,
    displayMode: 'fraction'
  };
}

function updateValues(context, buttonEffect) {
  updateShift(context, buttonEffect.shift);
  updateCursorPostion(context, buttonEffect.cursorPosition);
  updateInput(context, buttonEffect.inputValue, buttonEffect.cursorPosition);
  updateOutput(context, buttonEffect.outputValue, context.state.displayMode);
  updateStoredInputs(context, buttonEffect.storedInputs);
  updateStorePosition(context, buttonEffect.storePosition);
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
  context.setState({
    inputValue: inputValue,
    inputStr: parseToRender(inputValue, cursorPosition)
  });
}

function updateOutput(context, outputValue, displayMode) {
  context.setState({
    outputValue: outputValue,
    outputStr: parseToRender(outputValue, -1, displayMode)
  });
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
