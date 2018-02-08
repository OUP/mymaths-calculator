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
