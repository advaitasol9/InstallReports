/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  FailedModal,
} from '../index';

describe('FailedModal Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <FailedModal />,
  );
  expect(wrapper).toMatchSnapshot();
});
