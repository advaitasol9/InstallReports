import {
  compose, setStatic, withState, lifecycle,
} from 'recompose';
import { connect } from 'react-redux';
import { setChanges } from '../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../core/api';
import { setPartModalVisible } from '../../AppState';

import WorkOrderDetailsView from './WorkOrderDetailsView';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
      setModalVisible: payload => dispatch(setPartModalVisible(payload)),
    }),
  ),
  setStatic('navigationOptions', () => ({
    header: null,
  })),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('screen', 'setScreen', 'Main'),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  lifecycle({
    componentDidMount() {
      this.props.setChangesInOffline(this.props.changes.length);
      const screen = this.props.navigation.getParam('screen', null);
      if (screen) {
        this.props.setScreen(screen);
        this.props.setInProgress(true);
      }
      apiGetJson(`test-app-1/activities/${this.props.navigation.state.params.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(WorkOrderDetailsView);
