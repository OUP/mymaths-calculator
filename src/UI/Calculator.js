import React, { Component } from 'react';
import './Calculator.css';
import ButtonsGrid from './ButtonsGrid';
import { buttonAction } from '../Functionality/ButtonAction';
import { parseToRender } from '../Functionality/ParseToRender';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    this.state = {
      inputValue: [],
      inputStr: '¦',
      outputValue: ['0'],
      outputStr: '0',
      cursorPosition: 0,
      storedInputs: [],
      storePosition: -1
    };
  }

  press(button) {
    const buttonEffect = buttonAction(
      button,
      this.state.inputValue,
      this.state.outputValue,
      this.state.cursorPosition,
      this.state.storedInputs,
      this.state.storePosition
    );

    //Show error in UI if the button press didn't do anything.
    if (!buttonEffect) {
      this.setState({
        cursorPosition: 0,
        inputValue: [],
        inputStr: parseToRender([], 0),
        outputValue: [button + ' is WIP'],
        outputStr: parseToRender([button + ' is WIP'])
      });
      console.error(button + ' is a dead button.');
    } else {
      this.setState({
        cursorPosition: buttonEffect.cursorPosition,
        inputValue: buttonEffect.input,
        inputStr: parseToRender(
          buttonEffect.input,
          buttonEffect.cursorPosition
        ),
        outputValue: buttonEffect.output,
        outputStr: parseToRender(buttonEffect.output),
        storedInputs: buttonEffect.storedInputs,
        storePosition: buttonEffect.storePosition
      });
    }
  }

  render() {
    return (
      <div className="Calculator">
        <div className="InputDisplay">{this.state.inputStr}</div>
        <div className="OutputDisplay">{this.state.outputStr}</div>
        <ButtonsGrid press={this.press} position="top" />
        <ButtonsGrid press={this.press} position="middle" />
        <ButtonsGrid press={this.press} position="bottom" />
      </div>
    );
  }
}

export default Calculator;
