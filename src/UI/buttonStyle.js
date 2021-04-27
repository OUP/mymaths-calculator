import buttonType from '../Functionality/ButtonType';

export default function buttonStyle(button, shift = false, mode = false) {
  const type = buttonType(button);
  let style;

  switch (true) {
    case isStandardStyleButton(button, type):
      style = 'StandardButton';
      break;

    case isDelStyleButton(button):
      style = 'DelButton';
      break;

    case isModeStyleButton(button, type):
      style = 'ModeButton';
      break;

    case isSmallStyleButton(button):
      style = 'SmallButton';
      break;

    case isAngleModeButton(button):
      style = 'ShiftSmallButton';
      break;

    default:
      style = 'SmallButton';
      break;
  }

  return shiftStyle(shift, style, button);
}

function isStandardStyleButton(button, type) {
  const fitsStandardStyle =
    type === 'number' || type === 'operator' || type === 'Ans' || type === '=';
  const isException =
    button === '-' ||
    button === 'x!' ||
    button === '%' ||
    button === 'nPr' ||
    button === 'nCr';
  return fitsStandardStyle && !isException;
}

function isDelStyleButton(button) {
  return button === 'AC' || button === 'DEL';
}

function isSmallStyleButton(button) {
  return (
    button === 'xⁿ' ||
    button === '-' ||
    button === 'x²' ||
    button === 'x³' ||
    button === 'x⁻¹' ||
    button === 'x!' ||
    button === '%' ||
    button === 'nCr' ||
    button === 'nPr'
  );
}

function isModeStyleButton(button, type) {
  return isModeButton(type) && !isAngleModeButton(button);
}

function isAngleModeButton(button) {
  return button === 'deg' || button === 'rad';
}

function isModeButton(type) {
  return type === 'mode';
}

function isShiftedStyle(style, button) {
  return style === 'SmallButton' || button === 'shift';
}

function shiftStyle(shift, style, button) {
  if (shift === false) {
    return style;
  } else if (isShiftedStyle(style, button)) {
    return 'Shift' + style;
  } else {
    return style;
  }
}
