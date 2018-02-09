import React, { Component } from 'react';
import { buttonType } from '../Functionality/ButtonType';
import './CalcButton.css';

class CalcButton extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }

  press() {
    this.props.press(this.props.name);
  }

  render() {
    return (
      <div>
        <button
          className={buttonStyle(this.props.name, this.props.shift)}
          onClick={this.press}
        >
          {nameToLabelMap(this.props.name)}
        </button>
      </div>
    );
  }
}

function buttonStyle(button, shift = false) {
  const type = buttonType(button);
  let style;
  if (type === 'AC' || button === 'DEL') {
    style = 'DelButton';
  } else if (
    button === 'xⁿ' ||
    button === '-' ||
    button === 'x²' ||
    button === 'x!'
  ) {
    style = 'SmallButton';
  } else if (
    type === 'number' ||
    type === 'operator' ||
    type === 'Ans' ||
    type === '='
  ) {
    style = 'StandardButton';
  } else if (type === 'mode') {
    style = 'ModeButton';
  } else {
    style = 'SmallButton';
  }

  if (shift === false) {
    return style;
  } else if (style === 'SmallButton' || button === 'shift') {
    return 'Shift' + style;
  } else {
    return style;
  }
}

function nameToLabelMap(name) {
  switch (name) {
    case '-':
      return '(-)';

    default:
      return name;
  }
}

export default CalcButton;
