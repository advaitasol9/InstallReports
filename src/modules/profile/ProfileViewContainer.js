// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { logOut } from '../AppState';

import ProfileView from './ProfileView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      logOut: () => dispatch(logOut()),
    }),
  ),
)(ProfileView);
