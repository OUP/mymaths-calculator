//This will become more complicated to deal with fractions etc.
export function parseToRender(arr, cursorPosition = -1) {
  if (cursorPosition >= 0) {
    arr = addCursor(arr, cursorPosition);
  }

  let i,
    str = '';
  for (i = 0; i < arr.length; i++) {
    str += parseElement(arr[i]);
  }

  return str;
}

function addCursor(arr, position) {
  arr = arr.filter(x => x !== '¦');
  arr.splice(position, 0, '¦');
  return arr;
}

function parseElement(el) {
  if (typeof el === 'string') {
    return el;
  } else if (typeof el === 'number') {
    return el.toString();
  } else if (el.constructor === Array) {
    return el[0].toString();
  } else {
    return funcToStringMap(el.function) + parseToRender(el.argument);
  }
}

function funcToStringMap(func) {
  switch (func) {
    case '|x|':
      return '|';

    case 'log(x)':
      return 'log(';

    case 'ln(x)':
      return 'ln(';

    case '√(x)':
      return '√(';

    case 'sin(x)':
      return 'sin(';

    case 'cos(x)':
      return 'cos(';

    case 'tan(x)':
      return 'tan(';

    case '(':
      return '(';

    default:
      return "didn't render";
  }
}
