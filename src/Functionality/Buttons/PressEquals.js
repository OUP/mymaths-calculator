import { calcEval } from '../Eval/CalcEval';
import handleError from '../Eval/handleError';

export function pressEquals(currentState) {
  evalResult(currentState);
  currentState.storePosition = -1;
  currentState.cursorPosition = -1;
  currentState.shift = false;
  currentState.mode = false;

  if (decideToStore(currentState)) {
    currentState.storedInputs.push(currentState.inputValue);
  }
  currentState.displayMode = 'fraction';
  return currentState;
}

function evalResult(currentState) {
  try {
    currentState.outputValue = [
      calcEval(currentState.inputValue, currentState.outputValue)
    ];
  } catch (error) {
    console.log(error.name);
    currentState.outputValue = [handleError(error)];
  }
  return;
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
