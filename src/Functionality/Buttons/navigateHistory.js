export default function navigateHistory(button, currentState) {
  if (historyIsAccessible(currentState)) {
    accessHistory(button, currentState);
  }
  return;
}

function accessHistory(button, currentState) {
  switch (button) {
    case '⬆':
      cycleBackwards(currentState);
      break;

    case '⬇':
      cycleForwards(currentState);
      break;
  }
  return;
}

function cycleBackwards(currentState) {
  if (atDefaultStorePosition(currentState)) {
    moveToPenultimateStorePosition(currentState);
  } else if (atInitialStorePosition(currentState)) {
    moveToFinalStorePosition(currentState);
  } else {
    currentState.storePosition--;
  }
  setInputValue(currentState);
  return;
}

function cycleForwards(currentState) {
  if (atFinalStorePosition(currentState)) {
    moveToInitialStorePosition(currentState);
  } else {
    currentState.storePosition++;
  }
  setInputValue(currentState);
  return;
}

function historyIsAccessible(currentState) {
  return hasHistory(currentState) && readyToAccessHistory(currentState);
}

function hasHistory(currentState) {
  return currentState.storedInputs.length > 0;
}

function readyToAccessHistory(currentState) {
  return currentState.cursorPosition < 0;
}

function setInputValue(currentState) {
  currentState.inputValue =
    currentState.storedInputs[currentState.storePosition];
  return;
}

function atDefaultStorePosition({ storePosition }) {
  return storePosition === -1;
}

function atInitialStorePosition({ storePosition }) {
  return storePosition === 0;
}

function atFinalStorePosition(currentState) {
  return (
    currentState.storePosition === currentState.storedInputs.length - 1 ||
    atDefaultStorePosition(currentState)
  );
}

function moveToPenultimateStorePosition(currentState) {
  if (currentState.storedInputs.length >= 2) {
    currentState.storePosition = currentState.storedInputs.length - 2;
  } else if (currentState.storedInputs.length === 1) {
    currentState.storePosition = 0;
  }
  return;
}

function moveToInitialStorePosition(currentState) {
  currentState.storePosition = 0;
  return;
}

function moveToFinalStorePosition(currentState) {
  currentState.storePosition = currentState.storedInputs.length - 1;
  return;
}
