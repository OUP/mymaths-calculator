import { Component } from 'react';
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

export default ButtonsGrid;
