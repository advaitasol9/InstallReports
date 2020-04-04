// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson } from '../../../core/api';
import WorkOrderManagerView from './WorkOrderManagerView';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { setManagerModalVisible, setIncompleteModalVisible } from '../../AppState';
import { addManagerPhoto } from '../workOrderQuestions/WorkOrderQuestionsState';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      photos: state.workOrderQuestion.managerPhotos,
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setManagerModalVisible(payload)),
      setIncompleteModalVisible: payload => dispatch(setIncompleteModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addManagerPhoto(arr)),
    }),
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('signature', 'setSignature', []),
  withState('isLoading', 'setIsloading', true),
  withState('isQuestionsAnswered', 'setIsQuestionsAnswered', true),
  withState('isIncompleteOpen', 'setIsIncompleteOpen', false),
  withState('update', 'setUpdate', true),
  lifecycle({
    componentWillMount() {
      if (this.props.connectionStatus) {
        apiGetJson(`test-app-1/activities/${this.props.activityId}?with=["items"]`, this.props.token)
          .then(async (response) => {
            const installerAnswers = JSON.parse(response.data.installer_questions_answers);
            await this.props.setActivityData({
              ...response.data,
              installer_questions_answers: installerAnswers,
              manager_questions_answers: JSON.parse(response.data.manager_questions_answers),
            });
            this.props.setIsloading(false);
            if (installerAnswers === null ||
              installerAnswers.filter(answer => answer !== null).length < installerAnswers.length) {
              this.props.setIsIncompleteOpen(true);
            }
          });
      } else {
        this.props.setActivityData(
          this.props.orderList.filter(order => order.id === this.props.activityId)[0],
        );
        this.props.setIsloading(false);
      }
    },
  }),
)(WorkOrderManagerView);
