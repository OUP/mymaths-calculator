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
import {
  FractionExpression,
  Term,
  Expression
} from '../Functionality/Eval/Symbol';

function testSymbolMethods() {
  const A = new Expression([new Term(1, ['π'], [1])]);
  const B = new Expression([new Term(2)]);
  const C = B.minus(A);
  const F = C.plus(C).plus(C);
  console.log(F);
  return C.simplify();
}

class CalcBase extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    initialiseInternalState(this);
  }

  componentDidMount() {
    initialiseDisplay(this);
    katex.render(
      testSymbolMethods().toString(),
      document.getElementById('Output')
    );
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
