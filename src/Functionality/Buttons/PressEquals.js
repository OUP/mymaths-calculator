import { calcEval } from '../Eval/CalcEval';

export function pressEquals(currentState) {
  currentState.outputValue = [
    calcEval(currentState.inputValue, currentState.outputValue)
  ];
  currentState.storePosition = -1;
  currentState.cursorPosition = -1;
  currentState.shift = false;

  if (decideToStore(currentState)) {
    currentState.storedInputs.push(currentState.inputValue);
  }
  return currentState;
}

function decideToStore(currentState) {
  if (
    currentState.inputValue.length &&
    currentState.inputValue !==
      currentState.storedInputs[currentState.storedInputs.length - 1]
  ) {
    return true;
  } else {
    return false;
  }
}
