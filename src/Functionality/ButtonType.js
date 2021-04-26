export default function buttonType(b) {
  b = safeToString(b);

  switch (true) {
    case checkForSymbol(b):
      return 'symbol';

    case checkForSqrt(b):
      return 'sqrt';

    case checkForNumber(b):
      return 'number';

    case checkForOperator(b):
      return 'operator';

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

    case checkForError(b):
      return 'error';

    default:
      return 'function';
  }
}

function safeToString(b) {
  if (b || b === 0) {
    return makeString(b);
  } else {
    return '';
  }
}

function checkForNumber(b) {
  if (
    /^\d+$/.test(b) ||
    b.includes('.') ||
    b.includes('/') ||
    b.includes('(-)') ||
    b.includes('-')
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
    b === 'x!' ||
    b === '%' ||
    b === 'nCr' ||
    b === 'nPr' ||
    b === 'mixedFraction'
  ) {
    return true;
  } else {
    return false;
  }
}

function checkForSymbol(b) {
  if (b.includes('π')) {
    return true;
  } else {
    return false;
  }
}

function checkForSqrt(b) {
  if (b.includes('√') || b.includes('\\sqrt')) {
    return true;
  } else {
    return false;
  }
}

function checkForMode(b) {
  return (
    b === 'shift' ||
    b === 'mode' ||
    b === '⬅' ||
    b === '➡' ||
    b === '⬆' ||
    b === '⬇'
  );
}

function checkForDisplay(b) {
  if (b === 'S⇔D' || b === 'ENG' || b === 'mx⇔fr') {
    return true;
  } else {
    return false;
  }
}

function checkForMisc(b) {
  if (b === 'DEL' || b === 'AC' || b === 'Ans' || b === '=' || b === '|') {
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

function checkForError(b) {
  if (b.includes('error')) {
    return true;
  }
}

export function buttonSuperType(button) {
  const type = buttonType(button);

  switch (type) {
    case 'number':
    case 'operator':
    case 'symbol':
    case 'sqrt':
    case 'function':
    case 'Ans':
      return 'input';

    default:
      return type;
  }
}

export function makeString(decOrFrac) {
  if (decOrFrac) {
    if (decOrFrac.toFraction) {
      if (decOrFrac.toFraction().constructor === String) {
        return decOrFrac.toFraction();
      }
    }
  }
  return decOrFrac.toString();
}
