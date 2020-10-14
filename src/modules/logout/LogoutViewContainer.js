// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import LogoutView from './LogoutView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({})
  )
)(LogoutView);
