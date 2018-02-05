import React, { Component } from 'react';
import './Calculator.css';
import ButtonsGrid from './ButtonsGrid';
import { buttonAction } from '../Functionality/ButtonAction';
import { buttonType } from '../Functionality/ButtonType';
import { parseToRender } from '../Functionality/ParseToRender';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    this.state = {
      shift: false,
      inputValue: [],
      inputStr: '¦',
      outputValue: ['0'],
      outputStr: '0',
      cursorPosition: 0,
      storedInputs: [],
      storePosition: -1,
      displayMode: 'fraction'
    };
  }

  press(button) {
    const buttonEffect = buttonAction(
      button,
      this.state.inputValue,
      this.state.outputValue,
      this.state.cursorPosition,
      this.state.storedInputs,
      this.state.storePosition,
      this.state.shift,
      this.state.displayMode
    );

    //Show error in UI if the button press didn't do anything.
    if (!buttonEffect) {
      this.setState({
        shift: false,
        cursorPosition: 0,
        inputValue: [],
        inputStr: parseToRender([], 0),
        outputValue: [button + ' is WIP'],
        outputStr: parseToRender([button + ' is WIP'])
      });
      console.error(button + ' is a dead button.');
    } else {
      this.setState({
        shift: buttonEffect.shift,
        cursorPosition: buttonEffect.cursorPosition,
        inputValue: buttonEffect.input,
        inputStr: parseToRender(
          buttonEffect.input,
          buttonEffect.cursorPosition
        ),
        outputValue: buttonEffect.output,
        outputStr: parseToRender(
          buttonEffect.output,
          -1,
          this.state.displayMode
        ),
        storedInputs: buttonEffect.storedInputs,
        storePosition: buttonEffect.storePosition
      });
      if (buttonType(button) === 'display') {
        this.setState({
          outputStr: parseToRender(
            buttonEffect.output,
            -1,
            buttonEffect.displayMode
          ),
          displayMode: buttonEffect.displayMode
        });
      }
    }
  }

  render() {
    console.log('Calculator.state.shift:', this.state.shift);
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
