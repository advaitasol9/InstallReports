/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  CheckList,
} from '../index';

describe('CheckList Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <CheckList />,
  );
  expect(wrapper).toMatchSnapshot();
});
