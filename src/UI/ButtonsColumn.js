import React, { Component } from 'react';
import CalcButton from './CalcButton';
import { generateButtons } from './GenerateButtons';
import './ButtonsColumn.css';
import './CalcButton.css';

class ButtonsColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: generateButtons(this.props.position, this.props.column)
    };
    this.press = this.press.bind(this);
  }

  renderButtons() {
    return this.state.buttons.map(name => (
      <CalcButton key={name} name={name} press={this.press} />
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
