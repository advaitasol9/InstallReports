import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Platform, UIManager, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { setConnection } from './AppState';
import { setChanges } from './workOrder/WorkOrderState';

import AppView from './AppView';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
    }),
    dispatch => ({
      setConnection: mode => dispatch(setConnection(mode)),
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
  lifecycle({
    componentWillMount() {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-unused-expressions
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    },
    componentDidMount() {
      this.unsubscribe = NetInfo.addEventListener(async (state) => {
        this.props.setConnection(state.isConnected);
        if (state.isConnected && this.props.changes.length !== 0) {
          await this.props.changes.forEach((item) => {
            console.log(`send ${item.activityId}`);
          });
          await this.props.setChanges([]);
        }
      });
    },
    componentWillUnmount() {
      this.unsubscribe();
    },
  }),
)(AppView);
