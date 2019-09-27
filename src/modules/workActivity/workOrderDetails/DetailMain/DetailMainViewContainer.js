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
  withState('isLoading', 'setIsloading', true),
  withState('inProgress', 'setInProgress', false),
  withState('details', 'setDetails', []),
  lifecycle({
    async componentDidMount() {
      console.log(this.props);
      this.props.setChangesInOffline(this.props.changes.length);
      await apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          console.log(response);
          if (
            response.data.status !== 'Open'
            || response.data.status !== 'Open_Rejecte'
            || response.data.status !== 'Open_Partial'
          ) {
            this.props.setInProgress(true);
          }
          this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });
      await apiGetJson(
        `test-app-1/activities/${this.props.activityId}/details`,
        this.props.token,
        'multipart/form-data',
      )
        .then((response) => {
          console.log(response);
          this.props.setDetails(response.data[0]);
        });
    },
  }),
)(DetailMainView);
