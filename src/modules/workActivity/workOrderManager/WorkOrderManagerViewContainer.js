// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson } from '../../../core/api';
import WorkOrderManagerView from './WorkOrderManagerView';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { setManagerModalVisible } from '../../AppState';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setManagerModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
    }),
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('signature', 'setSignature', []),
  lifecycle({
    componentDidMount() {
      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(WorkOrderManagerView);
