import React from 'react';
import CalcButton from './CalcButton';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<CalcButton key="1" name="1" press={() => 0} shift={false} />);
});
