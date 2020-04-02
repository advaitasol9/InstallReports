/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  ActivityTitle,
} from '../index';

describe('ActivityTitle Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <ActivityTitle />,
  );
  expect(wrapper).toMatchSnapshot();
});
