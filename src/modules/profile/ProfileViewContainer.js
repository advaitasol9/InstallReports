// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { logOut } from '../AppState';

import ProfileScreen from './ProfileView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      logOut: () => dispatch(logOut()),
    }),
  ),
)(ProfileScreen);
