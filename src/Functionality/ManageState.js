import { buttonType } from './ButtonType';
import { buttonAction } from './ButtonAction';
import { parseToRender } from './ParseToRender';

export function updateState(context, button) {
  const buttonEffect = determineButtonEffect(context, button);
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

function determineButtonEffect(context, button) {
  return buttonAction(
    button,
    context.state.inputValue,
    context.state.outputValue,
    context.state.cursorPosition,
    context.state.storedInputs,
    context.state.storePosition,
    context.state.shift,
    context.state.displayMode
  );
}

function updateValues(context, buttonEffect) {
  updateShift(context, buttonEffect.shift);
  updateCursorPostion(context, buttonEffect.cursorPosition);
  updateInput(context, buttonEffect.input, buttonEffect.cursorPosition);
  updateOutput(context, buttonEffect.output, context.state.displayMode);
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

function updateInput(context, input, cursorPosition) {
  context.setState({
    inputValue: input,
    inputStr: parseToRender(input, cursorPosition)
  });
}

function updateOutput(context, output, displayMode) {
  context.setState({
    outputValue: output,
    outputStr: parseToRender(output, -1, displayMode)
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
    outputStr: parseToRender(buttonEffect.output, -1, buttonEffect.displayMode),
    displayMode: buttonEffect.displayMode
  });
}
