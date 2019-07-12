/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  ActivityInfoSection,
} from '../index';

describe('ActivityInfoSection Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <ActivityInfoSection />,
  );
  expect(wrapper).toMatchSnapshot();
});
