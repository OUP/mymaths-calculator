import React, { Component } from 'react';
import MathJax from 'react-mathjax-preview';
import Draggable from 'react-draggable';
import './CalcBase.css';
import ButtonsGrid from './ButtonsGrid';
import { updateState, initialiseState } from '../Functionality/ManageState';

class CalcBase extends Component {
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
      <Draggable>
        <div className="CalcBase">
          <div className="InputDisplay">
            <div id="Input">
              <MathJax math={this.state.inputStr} />
            </div>
          </div>
          <div className="OutputDisplay">
            <div id="Output">
              <MathJax className="OutputText" math={this.state.outputStr} />{' '}
            </div>
          </div>
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
      </Draggable>
    );
  }
}

export default CalcBase;
