/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';

import {
  QuestionsList,
} from '../index';

describe('QuestionsList Component', () => {
  it('renders as expected', () => {
  const wrapper = shallow(
    <QuestionsList />,
  );
  expect(wrapper).toMatchSnapshot();
});
