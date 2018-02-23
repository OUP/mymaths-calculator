import { buttonAction } from './ButtonAction';
import { parseToRender } from './ParseToRender';

export function updateState(context, button) {
  const buttonEffect = buttonAction(button, context.state);
  updateValues(context, buttonEffect);
}

export function initialiseInternalState(context) {
  context.state = {
    shift: false,
    inputValue: [],
    outputValue: ['0'],
    cursorPosition: 0,
    displayMode: 'fraction',
    storedInputs: [],
    storePosition: -1,
    functionKey: 0 //Used for automatically destroying hidden characters
  };
}

export function initialiseDisplay(context) {
  context.state.inputStr = parseToRender(context.state.inputValue, 'Input', 0);
  context.state.outputStr = parseToRender(
    context.state.outputValue,
    'Output',
    -1,
    context.state.displayMode
  );
}

function updateValues(context, buttonEffect) {
  updateShift(context, buttonEffect.shift);
  updateCursorPostion(context, buttonEffect.cursorPosition);
  updateDisplayMode(context, buttonEffect.displayMode);
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

function updateDisplayMode(context, displayMode) {
  context.setState({
    displayMode: displayMode
  });
}

function updateInput(context, inputValue, cursorPosition) {
  context.setState({
    inputValue: inputValue,
    inputStr: parseToRender(inputValue, 'Input', cursorPosition)
  });
}

function updateOutput(context, outputValue, displayMode) {
  context.setState({
    outputValue: outputValue,
    outputStr: parseToRender(outputValue, 'Output', -1, displayMode)
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

function updateFunctionKey(context, functionKey) {
  context.setState({
    functionKey: functionKey
  });
}
