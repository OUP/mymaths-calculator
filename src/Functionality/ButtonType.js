export default function buttonType(b) {
  b = safeToString(b);

  switch (true) {
    case checkForNumber(b):
      return 'number';

    case checkForOperator(b):
      return 'operator';

    case checkForSymbol(b):
      return 'symbol';

    case checkForMode(b):
      return 'mode';

    case checkForDisplay(b):
      return 'display';

    case checkForMisc(b):
      return b;

    case checkForOArg(b):
      return 'oArg';

    case checkForCArg(b):
      return 'cArg';

    case checkForNull(b):
      return null;

    default:
      return 'function';
  }
}

function safeToString(b) {
  if (b || b === 0) {
    return b.toString();
  } else {
    return '';
  }
}

function checkForNumber(b) {
  if (
    b === parseFloat(b).toString() ||
    b.includes('.') ||
    b.includes('/') ||
    b === '(-)' ||
    b === '-'
  ) {
    return true;
  } else {
    return false;
  }
}

function checkForOperator(b) {
  if (
    b === '+' ||
    b === '–' ||
    b === '×' ||
    b === '÷' ||
    b === '×10ⁿ' ||
    b === 'x²' ||
    b === 'x³' ||
    b === 'x⁻¹' ||
    b === 'x!' ||
    b === '%'
  ) {
    return true;
  } else {
    return false;
  }
}

function checkForSymbol(b) {
  if (b === 'π') {
    return true;
  } else {
    return false;
  }
}

function checkForMode(b) {
  if (b === 'shift' || b === '⬅' || b === '➡' || b === '⬆' || b === '⬇') {
    return true;
  } else {
    return false;
  }
}

function checkForDisplay(b) {
  if (b === 'S⇔D' || b === 'ENG') {
    return true;
  } else {
    return false;
  }
}

function checkForMisc(b) {
  if (b === 'DEL' || b === 'AC' || b === 'Ans' || b === '=' || b === '¦') {
    return true;
  } else {
    return false;
  }
}

function checkForOArg(b) {
  if (b.includes('oArg')) {
    return true;
  } else {
    return false;
  }
}

function checkForCArg(b) {
  if (b.includes('cArg')) {
    return true;
  } else {
    return false;
  }
}

function checkForNull(b) {
  if (b === '') {
    return true;
  } else {
    return false;
  }
}

export function buttonSuperType(button) {
  const type = buttonType(button);

  switch (true) {
    case type === 'number' ||
      type === 'operator' ||
      type === 'symbol' ||
      type === 'function' ||
      type === 'Ans':
      return 'input';

    default:
      return type;
  }
}
