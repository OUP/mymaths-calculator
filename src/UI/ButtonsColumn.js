import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      this.props.shift,
      this.props.mode
    );
  }

  renderButtons() {
    return this.chooseButtons().map(name => (
      <CalcButton
        key={name}
        name={name}
        press={this.press}
        shift={this.props.shift}
        mode={this.props.mode}
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

ButtonsColumn.propTypes = {
  press: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
  shift: PropTypes.bool,
  mode: PropTypes.bool
};

export default ButtonsColumn;
