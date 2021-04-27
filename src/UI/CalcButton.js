import React, { Component } from 'react';
import katex from 'katex';
import PropTypes from 'prop-types';
import buttonType from '../Functionality/ButtonType';
import './CalcButton.css';

class CalcButton extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }

  componentDidMount() {
    const name = this.props.name;
    if (hasTeX(name)) {
      katex.render(nameToLabelMap(name), document.getElementById(name));
    }
  }

  press() {
    this.props.press(this.props.name);
  }

  render() {
    return (
      <div>
        <button
          className={buttonStyle(
            this.props.name,
            this.props.shift,
            this.props.mode
          )}
          onClick={this.press}
          id={this.props.name}
        >
          {nameToLabelMap(this.props.name)}
        </button>
      </div>
    );
  }
}

CalcButton.propTypes = {
  press: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  shift: PropTypes.bool,
  mode: PropTypes.bool
};

function buttonStyle(button, shift = false, mode = false) {
  const type = buttonType(button);
  let style;
  if (type === 'AC' || button === 'DEL') {
    style = 'DelButton';
  } else if (
    button === 'xⁿ' ||
    button === '-' ||
    button === 'x²' ||
    button === 'x³' ||
    button === 'x⁻¹' ||
    button === 'x!' ||
    button === '%' ||
    button === 'nCr' ||
    button === 'nPr'
  ) {
    style = 'SmallButton';
  } else if (
    type === 'number' ||
    type === 'operator' ||
    type === 'Ans' ||
    type === '='
  ) {
    style = 'StandardButton';
  } else if (isModeStyleButton(button, type)) {
    style = 'ModeButton';
  } else if (isAngleModeButton(button)) {
    style = 'ShiftSmallButton';
  } else {
    style = 'SmallButton';
  }

  if (shift === false) {
    return style;
  } else if (isShiftedStyle(style, button)) {
    return 'Shift' + style;
  } else {
    return style;
  }
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

function nameToLabelMap(name) {
  switch (name) {
    case 'x²':
      return '{x^2}';

    case 'x³':
      return '{x^3}';

    case '|x|':
      return '{\\text{Abs}}';

    case 'xⁿ':
      return '{x^{\\Box}}';

    case 'x⁻¹':
      return '{x^{-1}}';

    case 'log(x)':
      return '{\\text{log}}';

    case 'logₐ(x)':
      return '{\\text{log}_\\Box \\Box}';

    case 'ln(x)':
      return '{\\text{ln}}';

    case 'eⁿ':
      return 'e^{\\Box}';

    case 'x!':
      return '{x!}';

    case 'frac':
      return '{\\frac {\\Box} {\\Box}}';

    case '√(x)':
      return '{\\sqrt {\\Box}}';

    case 'ⁿ√(x)':
      return '{{}^\\Box \\sqrt {\\Box}}';

    case 'sin(x)':
      return '{\\text{sin}}';

    case 'sin⁻¹':
      return '{\\text{sin}^{-1}}';

    case 'cos(x)':
      return '{\\text{cos}}';

    case 'cos⁻¹':
      return '{\\text{cos}^{-1}}';

    case 'tan(x)':
      return '{\\text{tan}}';

    case 'tan⁻¹':
      return '{\\text{tan}^{-1}}';

    case '%':
      return '{\\%}';

    case '-':
      return '{(\\text{-})}';

    case '(':
      return '{(}';

    case ')':
      return '{)}';

    case 'π':
      return '{π}';

    // case '⬅':
    //   return '{\\leftarrow}';

    // case '➡':
    //   return '{\\rightarrow}';

    // case '⬆':
    //   return '{\\uparrow}';

    // case '⬇':
    //   return '{\\downarrow}';

    default:
      return name;
  }
}

function hasTeX(name) {
  return name.includes && nameToLabelMap(name).includes('{');
}

function isShiftedStyle(style, button) {
  return style === 'SmallButton' || button === 'shift';
}

export default CalcButton;
