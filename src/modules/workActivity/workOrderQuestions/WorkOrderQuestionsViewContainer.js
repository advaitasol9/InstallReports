import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson } from '../../../core/api';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import WorkOrderQuestionsView from './WorkOrderQuestionsView';
import { addQuestionPhoto } from './WorkOrderQuestionsState';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      photos: state.workOrderQuestion.photos,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addQuestionPhoto(arr)),
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('isLoading', 'setIsloading', true),
  lifecycle({
    componentWillMount() {
      console.log(this.props)
      if (this.props.connectionStatus) {
        apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
          .then(async (response) => {
            await this.props.setActivityData(response.data);
            this.props.setIsloading(false);
          });
      } else {
        this.props.setActivityData(
          this.props.orderList.filter(order => order.id === this.props.activityId)[0],
        );
        this.props.setIsloading(false);
      }
    },
  }),
)(WorkOrderQuestionsView);
