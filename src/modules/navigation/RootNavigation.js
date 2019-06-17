import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import WorkOrderTabNavigator from './WorkOrderTabNavigator';

import AuthScreen from '../auth/AuthViewContainer';
import CameraScreen from '../camera/CameraViewContainer';

const AuthStack = createStackNavigator({
  LogIn: {
    screen: AuthScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const CameraStack = createStackNavigator({
  Camera: {
    screen: CameraScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const RootStack = createSwitchNavigator({
  Auth: {
    screen: AuthStack,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: MainTabNavigator,
  },
  WorkOrder: {
    screen: WorkOrderTabNavigator,
  },
  CameraStack: {
    screen: CameraStack,
  },
}, {
  initialRouteName: 'Auth',
});

export default createAppContainer(RootStack);
