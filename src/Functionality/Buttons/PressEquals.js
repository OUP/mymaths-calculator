import { calcEval } from '../CalcEval';

export function pressEquals(currentState) {
  currentState.outputValue = [
    calcEval(currentState.inputValue, currentState.outputValue)
  ];
  currentState.cursorPosition = -1;
  return currentState;
}
