/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  OrderListTile,
} from '../index';

describe('OrderListTile Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <OrderListTile />,
  );
  expect(wrapper).toMatchSnapshot();
});
