import React, { Component } from 'react';
import './Calculator.css';
import CalcBase from './UI/CalcBase';

class Calculator extends Component {
  render() {
    return (
      <div className="Calculator">
        <CalcBase />
      </div>
    );
  }
}

export default Calculator;
