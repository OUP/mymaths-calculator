import React, { Component } from 'react';
import CalcButton from './CalcButton';
import { generateButtons } from './GenerateButtons';
import './ButtonsColumn.css';
import './CalcButton.css';

class ButtonsColumn extends Component {
  constructor(props) {
    super(props);
    this.chooseButtons = this.chooseButtons.bind(this);
    this.press = this.press.bind(this);
  }

  chooseButtons() {
    return generateButtons(
      this.props.position,
      this.props.column,
      this.props.shift
    );
  }

  renderButtons() {
    return this.chooseButtons().map(name => (
      <CalcButton
        key={name}
        name={name}
        press={this.press}
        shift={this.props.shift}
      />
    ));
  }

  press(name) {
    this.props.press(name);
  }

  render() {
    return <div className="ButtonsColumn">{this.renderButtons()}</div>;
  }
}

export default ButtonsColumn;
