import React from 'react';
import Calculator from './Calculator';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<Calculator />);
});
