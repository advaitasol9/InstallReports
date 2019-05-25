// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import WorkActivityView from './WorkActivityView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(WorkActivityView);
