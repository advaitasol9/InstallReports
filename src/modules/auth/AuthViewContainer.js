// @flow
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { logIn, logOut } from '../AppState';
import { setUserInfo } from '../profile/ProfileState';
import { logout } from '../../core/api';


import AuthView from './AuthView';

export default compose(
  withState('password', 'setPassword', ''),
  withState('email', 'setEmail', ''),
  connect(
    state => ({
      authState: state.app,
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected,
    }),
    dispatch => ({
      logIn: () => dispatch(logIn()),
      logOut: () => dispatch(logOut()),
      setUserInfo: data => dispatch(setUserInfo(data)),
    }),
  ),
  lifecycle({
    componentDidMount() {
      const itemId = this.props.navigation.getParam('logOut', null);
      if (itemId) {
        this.props.logOut();
        logout('logout/', this.props.token);
      } else if (this.props.authState.isLoggedIn) {
        this.props.navigation.navigate({ routeName: 'Home' });
      }
    },
  }),
)(AuthView);
