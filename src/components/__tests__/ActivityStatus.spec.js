/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  ActivityStatus,
} from '../index';

describe('ActivityStatus Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <ActivityStatus />,
  );
  expect(wrapper).toMatchSnapshot();
});
