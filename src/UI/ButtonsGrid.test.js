import React from 'react';
import ButtonsGrid from './ButtonsGrid';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<ButtonsGrid press={() => 0} shift={false} position="middle" />);
});
