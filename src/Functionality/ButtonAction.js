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
  let currentInputValue = currentState.inputValue;
  const currentOutputValue = currentState.outputValue;
  let cursorPosition = currentState.cursorPosition;
  const storedInputs = currentState.storedInputs;
  const storePosition = currentState.storePosition;
  const shift = currentState.shift;
  const displayMode = currentState.displayMode;
  let buttonOutput;

  //Store input and clear on first button input after pressing =
  if (
    cursorPosition === -1 &&
    button !== '=' &&
    bType !== 'mode' &&
    bType !== 'display'
  ) {
    if (currentInputValue !== []) {
      if (!storedInputs.length) {
        storedInputs.push(currentInputValue);
      } else if (storedInputs[storedInputs.length - 1] !== currentInputValue) {
        //Don't store if input is unchanged
        storedInputs.push(currentInputValue);
      }
    }
    currentInputValue = [];
    cursorPosition = 0;
  } else if (storePosition === -1 && (button === '⬆' || button === '⬇')) {
    storedInputs.push(currentInputValue);
  }

  switch (bSuperType) {
    case 'input':
      buttonOutput = pressInput(
        button,
        bType,
        currentInputValue,
        currentOutputValue,
        cursorPosition
      );
      break;

    case '=':
      buttonOutput = pressEquals(currentInputValue, currentOutputValue);
      break;

    case 'DEL':
      buttonOutput = pressDel(
        currentInputValue,
        currentOutputValue,
        cursorPosition
      );
      break;

    case 'AC':
      buttonOutput = pressAC();
      break;

    case 'mode':
      buttonOutput = pressMode(
        button,
        currentInputValue,
        currentOutputValue,
        cursorPosition,
        storedInputs,
        storePosition,
        shift
      );
      break;

    case 'display':
      buttonOutput = pressDisplay(
        button,
        currentInputValue,
        currentOutputValue,
        cursorPosition,
        storedInputs,
        storePosition,
        shift,
        displayMode
      );
      break;

    default:
      console.error('Unhandled button press.');
      break;
  }

  buttonOutput.storedInputs = storedInputs;
  return buttonOutput;
}
