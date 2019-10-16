// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson } from '../../../core/api';
import WorkOrderManagerView from './WorkOrderManagerView';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { setManagerModalVisible, setIncompleteModalVisible } from '../../AppState';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setManagerModalVisible(payload)),
      setIncompleteModalVisible: payload => dispatch(setIncompleteModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
    }),
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('signature', 'setSignature', []),
  withState('isLoading', 'setIsloading', true),
  withState('isQuestionsAnswered', 'setIsQuestionsAnswered', true),
  lifecycle({
    componentWillMount() {
      console.log(this.props);
      if (this.props.connectionStatus) {
        apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
          .then((response) => {
            console.log(response);
            this.props.setActivityData(response.data);
            this.props.setIsloading(false);
          });
        this.props.setIsQuestionsAnswered(true);
        if (this.props.isQuestionsAnswered) {
          this.props.setIncompleteModalVisible(true);
        }
      } else {
        this.props.setActivityData(
          this.props.orderList.filter(order => order.id === this.props.activityId)[0],
        );
        this.props.setIsloading(false);
      }
    },
  }),
)(WorkOrderManagerView);
