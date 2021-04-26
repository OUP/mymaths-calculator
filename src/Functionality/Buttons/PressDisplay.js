export function pressDisplay(button, currentState) {
  switch (button) {
    case 'S⇔D':
      if (
        currentState.displayMode === 'fraction' ||
        currentState.displayMode === 'default'
      ) {
        currentState.displayMode = 'decimal';
      } else {
        currentState.displayMode = 'fraction';
      }
      break;

    case 'mx⇔fr':
      if (currentState.displayMode !== 'mixed') {
        currentState.displayMode = 'mixed';
      } else {
        currentState.displayMode = 'fraction';
      }
      break;

    case 'ENG':
      pressENG(currentState);
      break;

    default:
      break;
  }

  currentState.shift = false;
  currentState.mode = false;
  return currentState;
}

function pressENG(currentState) {
  switch (currentState.displayMode) {
    default:
      currentState.displayMode = 'ENG0';
      break;

    case 'ENG0':
      currentState.displayMode = 'ENG1';
      break;

    case 'ENG1':
      currentState.displayMode = 'ENG2';
      break;

    case 'ENG2':
      currentState.displayMode = 'ENG2';
      break;
  }
  return;
}
