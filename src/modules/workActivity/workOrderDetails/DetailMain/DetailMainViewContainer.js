import {
  compose, withState, lifecycle,
} from 'recompose';
import { connect } from 'react-redux';

import { setChanges, setActivityId } from '../../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../../core/api';
import { setPartModalVisible } from '../../../AppState';

import DetailMainView from './DetailMainView';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
      setModalVisible: payload => dispatch(setPartModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('activityData', 'setActivityData', {}),
  withState('inProgress', 'setInProgress', false),
  lifecycle({
    componentDidMount() {
      console.log(this.props);
      this.props.setChangesInOffline(this.props.changes.length);
      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(DetailMainView);
