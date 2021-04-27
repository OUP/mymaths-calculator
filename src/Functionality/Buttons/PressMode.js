import moveCursor from './moveCursor';
import navigateHistory from './navigateHistory';

export function pressMode(button, currentState) {
  switch (button) {
    case 'shift':
    case 'mode':
      invertProperty(currentState, button);
      break;

    case '⬅':
    case '➡':
      moveCursor(button, currentState);
      break;

    case '⬆':
    case '⬇':
      navigateHistory(button, currentState);
      break;

    case 'deg':
    case 'rad':
      setAngleMode(button, currentState);
      break;

    default:
      console.error(button + ' is WIP');
      break;
  }
  return currentState;
}

function invertProperty(currentState, property) {
  const currentValue = Boolean(currentState[property]);
  currentState[property] = !currentValue;
  return;
}

function setAngleMode(button, currentState) {
  currentState.angleMode = button;
  currentState.mode = false;
  return;
}
