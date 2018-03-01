import React, { Component } from 'react';
import Draggable from 'react-draggable';
import './CalcBase.css';
import ButtonsGrid from './ButtonsGrid';
import {
  updateState,
  initialiseInternalState,
  initialiseDisplay
} from '../Functionality/ManageState';
import katex from 'katex';

import { Term } from '../Functionality/Eval/Symbol';

function testSymbolMethods() {
  const x = new Term(6, ['x'], [1]);
  const y = new Term(3, ['x'], [2]);
  const z = new Term(4, ['x', 'y'], [2, 3]);
  const A = x.plus(y).divBy(z);
  const B = y.plus(z);
  const C = A.divBy(B).simplify();
  return A.divBy(B)
    .simplify()
    .numerator.toString();
}

class CalcBase extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    initialiseInternalState(this);
  }

  componentDidMount() {
    initialiseDisplay(this);
    katex.render(testSymbolMethods(), document.getElementById('test'));
  }

  press(button) {
    updateState(this, button);
  }

  render() {
    return (
      <Draggable>
        <div className="CalcBase">
          <div id="Input" className="InputDisplay" />
          <div className="OutputDisplay">
            <div id="Output" className="OutputText" />
          </div>
          <div id="test" className="OutputDisplay" />
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
