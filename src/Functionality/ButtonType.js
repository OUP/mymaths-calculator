export function buttonType(b) {
  if(b || b === 0){
    b = b.toString();
  } else {
    b = '';
  }

  if (
    b === parseFloat(b).toString()
    || b.includes('.')
  ) {
    return 'number';
  } else if (
    b === '+'
    || b === '–'
    || b === '×'
    || b === '÷'
    || b === '×10ⁿ'
  ) {
    return 'operator';
  } else if (
    b === 'shift'
    || b === '⬅'
    || b === '⮕'
    || b === '⬆'
    || b === '⬇'
  ) {
    return 'mode';
  } else if (
    b === 'DEL'
    || b ==='AC'
    || b === 'Ans'
    || b === '='
  ) {
    return b;
  } else if (b === '') {
    return null;
  } else {
    return 'function'
  }
}
