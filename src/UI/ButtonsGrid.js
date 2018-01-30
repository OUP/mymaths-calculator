import React, { Component } from 'react';
import ButtonsColumn from './ButtonsColumn';
import './ButtonsGrid.css';

class ButtonsGrid extends Component {
  render(){
    return (genButtonsGrid(this, this.props.position));
  }

  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }

  press(name) {
    this.props.press(name);
  };
}

function genButtonsGrid(context, position) {
  switch (position) {
    case 'top':
      return (
        <div className="ButtonsGrid">
          <ButtonsColumn position='top' column="0" press={context.press} />
          <ButtonsColumn position='top' column="1" press={context.press} />
          <ButtonsColumn position='top' column="2" press={context.press} />
          <ButtonsColumn position='top' column="3" press={context.press} />
          <ButtonsColumn position='top' column="4" press={context.press} />
        </div>
      );

    case 'middle':
      return (
        <div className="ButtonsGrid">
          <ButtonsColumn position='middle' column="0" press={context.press} />
          <ButtonsColumn position='middle' column="1" press={context.press} />
          <ButtonsColumn position='middle' column="2" press={context.press} />
          <ButtonsColumn position='middle' column="3" press={context.press} />
          <ButtonsColumn position='middle' column="4" press={context.press} />
          <ButtonsColumn position='middle' column="5" press={context.press} />
        </div>
      );

    case 'bottom':
    return (
      <div className="ButtonsGrid">
        <ButtonsColumn position='bottom' column="0" press={context.press} />
        <ButtonsColumn position='bottom' column="1" press={context.press} />
        <ButtonsColumn position='bottom' column="2" press={context.press} />
        <ButtonsColumn position='bottom' column="3" press={context.press} />
        <ButtonsColumn position='bottom' column="4" press={context.press} />
      </div>
    );

    default:
    console.error('Invalid position for ButtonsGrid')
    break;
  }
}

export default ButtonsGrid;