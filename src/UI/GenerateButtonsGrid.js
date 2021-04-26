import React from 'react';
import ButtonsColumn from './ButtonsColumn';

export function genButtonsGrid(context, position) {
  switch (position) {
    case 'top':
      return (
        <div className="ButtonsGrid">
          <ButtonsColumn
            position="top"
            column="0"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="top"
            column="1"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="top"
            column="2"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="top"
            column="3"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="top"
            column="4"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="top"
            column="5"
            press={context.press}
            shift={context.props.shift}
          />
        </div>
      );

    case 'middle':
      return (
        <div className="ButtonsGrid">
          <ButtonsColumn
            position="middle"
            column="0"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="middle"
            column="1"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="middle"
            column="2"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="middle"
            column="3"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="middle"
            column="4"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="middle"
            column="5"
            press={context.press}
            shift={context.props.shift}
          />
        </div>
      );

    case 'bottom':
      return (
        <div className="ButtonsGrid">
          <ButtonsColumn
            position="bottom"
            column="0"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="bottom"
            column="1"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="bottom"
            column="2"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="bottom"
            column="3"
            press={context.press}
            shift={context.props.shift}
          />
          <ButtonsColumn
            position="bottom"
            column="4"
            press={context.press}
            shift={context.props.shift}
          />
        </div>
      );

    default:
      console.error('Invalid position for ButtonsGrid');
      break;
  }
}
