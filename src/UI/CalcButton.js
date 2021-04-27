import React, { Component } from 'react';
import katex from 'katex';
import PropTypes from 'prop-types';
import './CalcButton.css';
import nameToLabelMap from './nameToLabelMap';
import buttonStyle from './buttonStyle';

class CalcButton extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }

  componentDidMount() {
    const name = this.props.name;
    if (hasTeX(name)) {
      katex.render(nameToLabelMap(name), document.getElementById(name));
    }
  }

  press() {
    this.props.press(this.props.name);
  }

  render() {
    return (
      <div>
        <button
          className={buttonStyle(
            this.props.name,
            this.props.shift,
            this.props.mode
          )}
          onClick={this.press}
          id={this.props.name}
        >
          {nameToLabelMap(this.props.name)}
        </button>
      </div>
    );
  }
}

CalcButton.propTypes = {
  press: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  shift: PropTypes.bool,
  mode: PropTypes.bool
};

function hasTeX(name) {
  return name.includes && nameToLabelMap(name).includes('{');
}

export default CalcButton;
