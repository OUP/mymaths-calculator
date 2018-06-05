import React from 'react';
import ButtonsColumn from './ButtonsColumn';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(
    <ButtonsColumn position="top" column="0" press={() => 0} shift={false} />
  );
});
