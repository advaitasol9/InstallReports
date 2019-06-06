import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import WorkOrderTabNavigator from './WorkOrderTabNavigator';

import AuthScreen from '../auth/AuthViewContainer';

const AuthStack = createStackNavigator({
  LogIn: {
    screen: AuthScreen,
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
}, {
  initialRouteName: 'Auth',
});

export default createAppContainer(RootStack);
