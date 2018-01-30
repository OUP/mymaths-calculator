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
        <button className={buttonStyle(this.props.name)} onClick={this.press}>
          {this.props.name}
        </button>
      </div>
    );
  }
}

function buttonStyle(button) {
  const type = buttonType(button);
  if (type === 'AC' || button === 'DEL') {
    return 'DelButton';
  } else if (button === 'xⁿ') {
    return 'SmallButton';
  } else if (
    type === 'number' ||
    type === 'operator' ||
    type === 'Ans' ||
    type === '='
  ) {
    return 'StandardButton';
  } else if (type === 'mode') {
    return 'ModeButton';
  } else {
    return 'SmallButton';
  }
}

export default CalcButton;
