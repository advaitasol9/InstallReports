import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import WorkOrderTabNavigator from './WorkOrderTabNavigator';

import AuthScreen from '../auth/AuthViewContainer';
import CameraScreen from '../camera/CameraViewContainer';
import PdfScreen from '../pdfDocument/PdfDocumentViewContainer';

const AuthStack = createStackNavigator({
  LogIn: {
    screen: AuthScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const PdfStack = createStackNavigator({
  PdfDoc: {
    screen: PdfScreen,
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
  PdfStack: {
    screen: PdfStack,
  },
}, {
  initialRouteName: 'Auth',
});

export default createAppContainer(RootStack);
