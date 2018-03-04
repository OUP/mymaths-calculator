import { Component } from 'react';
import PropTypes from 'prop-types';
import { genButtonsGrid } from './GenerateButtonsGrid';
import './ButtonsGrid.css';

class ButtonsGrid extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }

  press(name) {
    this.props.press(name);
  }

  render() {
    return genButtonsGrid(this, this.props.position, this.props.shift);
  }
}

ButtonsGrid.propTypes = {
  press: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
  shift: PropTypes.bool
};

export default ButtonsGrid;
