// @flow
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { logIn, logOut } from '../AppState';
import { setUserInfo } from '../profile/ProfileState';


import AuthView from './AuthView';

export default compose(
  withState('password', 'setPassword', ''),
  withState('email', 'setEmail', ''),
  connect(
    state => ({
      authState: state.app,
      token: state.profile.security_token.token,
    }),
    dispatch => ({
      logIn: () => dispatch(logIn()),
      logOut: () => dispatch(logOut()),
      setUserInfo: data => dispatch(setUserInfo(data)),
    }),
  ),
  lifecycle({
    componentDidMount() {
      if (!this.props.authState.isLoggedIn) {
        this.props.navigation.navigate({ routeName: 'Main' });
      }
    },
  }),
)(AuthView);
