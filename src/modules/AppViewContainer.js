import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Platform, UIManager, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import AppView from './AppView';

export default compose(
  lifecycle({
    componentWillMount() {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-unused-expressions
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      const unsubscribe = NetInfo.addEventListener((state) => {
        console.log(state);
      });
    },
    componentWillUnmount() {
    },
  }),
)(AppView);
