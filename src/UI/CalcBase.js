import React, { Component } from 'react';
import './CalcBase.css';
import ButtonsGrid from './ButtonsGrid';
import {
  updateState,
  initialiseInternalState,
  initialiseDisplay
} from '../Functionality/ManageState';

class CalcBase extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    initialiseInternalState(this);
  }

  componentDidMount() {
    initialiseDisplay(this);
  }

  press(button) {
    updateState(this, button);
  }

  render() {
    return (
      <div className="CalcBase">
        <div id="Input" className="InputDisplay" />
        <div className="OutputDisplay">
          <div id="Output" className="OutputText" />
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
    );
  }
}

export default CalcBase;
