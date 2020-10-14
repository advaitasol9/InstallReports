// @flow
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { logIn, logOut } from '../AppState';
import { setUserInfo } from '../profile/ProfileState';
import { logout } from '../../core/api';
import AuthView from './AuthView';
import AsyncStorage from '@react-native-community/async-storage';
import { setNewPath, state } from '../../core/mainEnv';

export default compose(
  withState('password', 'setPassword', ''),
  withState('email', 'setEmail', ''),
  withState('apiPath', 'setApiPath', ''),
  connect(
    state => ({
      authState: state.app,
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected
    }),
    dispatch => ({
      logIn: () => dispatch(logIn()),
      logOut: () => dispatch(logOut()),
      setUserInfo: data => dispatch(setUserInfo(data))
    })
  ),
  lifecycle({
    async componentDidMount() {
      const data = await AsyncStorage.getItem('apipaths');
      await setNewPath(JSON.parse(data),null)
      const itemId = this.props.navigation.getParam('logOut', null);
      if (itemId) {
        AsyncStorage.removeItem('apipaths');
        this.props.logOut();
        setNewPath("");
        logout('logout/', this.props.token);
      } else if (this.props.authState.isLoggedIn) {
        this.props.navigation.navigate({ routeName: 'Home' });
      }
    }
  })
)(AuthView);
