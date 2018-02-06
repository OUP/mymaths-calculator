import React, { Component } from 'react';
import './Calculator.css';
import ButtonsGrid from './ButtonsGrid';
import { updateState, initialiseState } from '../Functionality/ManageState';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    initialiseState(this);
  }

  press(button) {
    updateState(this, button);
  }

  render() {
    return (
      <div className="Calculator">
        <div className="InputDisplay">{this.state.inputStr}</div>
        <div className="OutputDisplay">{this.state.outputStr}</div>
        <ButtonsGrid
          press={this.press}
          shift={this.state.shift}
          position="top"
        />
        <ButtonsGrid
          press={this.press}
          shift={this.state.shift}
          position="middle"
        />
        <ButtonsGrid
          press={this.press}
          shift={this.state.shift}
          position="bottom"
        />
      </div>
    );
  }
}

export default Calculator;
