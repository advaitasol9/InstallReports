/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  IncompleteModal,
} from '../index';

describe('IncompleteModal Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <IncompleteModal />,
  );
  expect(wrapper).toMatchSnapshot();
});
