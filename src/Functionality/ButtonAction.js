import { buttonType } from './ButtonType';
import { buttonSuperType } from './ButtonType';
import { pressInput } from './Buttons/PressInput';
import { pressEquals } from './Buttons/PressEquals';
import { pressDel } from './Buttons/PressDel';
import { pressAC } from './Buttons/PressAC';
import { pressMode } from './Buttons/PressMode';
import { pressDisplay } from './Buttons/PressDisplay';

export function buttonAction(button, currentState) {
  const bType = buttonType(button);
  const bSuperType = buttonSuperType(button);

  //Store input and clear on first button input after pressing =
  if (
    currentState.cursorPosition === -1 &&
    button !== '=' &&
    bType !== 'mode' &&
    bType !== 'display'
  ) {
    if (currentState.inputValue !== []) {
      if (!currentState.storedInputs.length) {
        currentState.storedInputs.push(currentState.inputValue);
      } else if (
        currentState.storedInputs[currentState.storedInputs.length - 1] !==
        currentState.inputValue
      ) {
        //Don't store if input is unchanged
        currentState.storedInputs.push(currentState.inputValue);
      }
    }
    currentState.inputValue = [];
    currentState.cursorPosition = 0;
  } else if (
    currentState.storePosition === -1 &&
    (button === '⬆' || button === '⬇')
  ) {
    currentState.storedInputs.push(currentState.inputValue);
  }

  switch (bSuperType) {
    case 'input':
      return pressInput(button, bType, currentState);

    case '=':
      return pressEquals(currentState);

    case 'DEL':
      return pressDel(currentState);

    case 'AC':
      return pressAC(currentState);

    case 'mode':
      return pressMode(button, currentState);

    case 'display':
      return pressDisplay(button, currentState);

    default:
      currentState.outputValue = ['error'];
      return currentState;
  }
}
