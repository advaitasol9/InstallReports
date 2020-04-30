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
      photos: state.workOrderQuestion.questionsPhotos,
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
  withState('activityData', 'setActivityData', {}),
  withState('isLoading', 'setIsloading', true),
  withState('update', 'setUpdate', true),
  lifecycle({
    componentWillMount() {
      if (this.props.connectionStatus) {
        apiGetJson(`activities/${this.props.activityId}?with=["items"]`, this.props.token)
          .then((response) => {
            this.props.setActivityData({
              ...response.data,
              installer_questions_answers: JSON.parse(response.data.installer_questions_answers),
            });
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
