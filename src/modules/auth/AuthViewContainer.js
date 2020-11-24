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
  withState('cancleRendering','setCancleRendering',true),
  connect(
    state => ({
      authState: state.app,
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected,
      selectedEndpoint: state.app.selectedEndpoint
    }),
    dispatch => ({
      logIn: (selectedEndpoint) => dispatch(logIn(selectedEndpoint)),
      logOut: () => dispatch(logOut()),
      setUserInfo: data => dispatch(setUserInfo(data))
    })
  ),
  lifecycle({
    async componentWillMount() {
        
      
      const authData = JSON.parse(await AsyncStorage.getItem('savedAuthResponse'));
      const isLoggedOut = (await this.props.navigation.getParam('logOut', false));
      
      if(isLoggedOut){
        this.props.setCancleRendering = false;
        await this.props.logOut();
        await AsyncStorage.removeItem('apipaths');
      }

      if(this.props.authState.isLoggedIn){
        await setNewPath(null,{key:this.props.selectedEndpoint.apiPath,value:this.props.selectedEndpoint.name});
        await this.props.setUserInfo(authData);
        await this.props.navigation.navigate({ routeName: 'Home' });
      }
      else{
        this.props.setCancleRendering = false;
      }
            
    },

  })
)(AuthView);
