import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson, apiGet } from '../../../core/api';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import WorkOrderQuestionsView from './WorkOrderQuestionsView';
import { addQuestionPhoto, clearPhotos } from './WorkOrderQuestionsState';
import { $CombinedState } from 'redux';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      photos: state.workOrderQuestion.questionsPhotos,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addQuestionPhoto(arr)),
      clearPhotos: () => dispatch(clearPhotos()),
      setChanges: arr => dispatch(setChanges(arr))
    })
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('isLoading', 'setIsloading', true),
  withState('update', 'setUpdate', true),
  withState('signature', 'setSignature', []),
  lifecycle({
    componentWillMount() {
      if (this.props.connectionStatus) {
        apiGetJson(`activities/${this.props.activityId}?with=["items"]`, this.props.token).then(async response => {
          var photoIds = [];
          var installer_answers_photos = [];

          (JSON.parse(response.data.installer_questions_answers) ?? []).map(questions => {
            if (questions.type == 'photo') {
              var tempIds = [];
              var dataArray = [];
              if (questions.answers != undefined) {
                questions.answers.map(item => {
                  photoIds.push(item);
                  tempIds.push(item);
                });
                tempIds.map(dataId => {
                  dataArray.push({ file_id: dataId });
                });
                installer_answers_photos.push({
                  question_order_id: questions.order,
                  data: dataArray
                });
              }
            } else if (questions.type == 'signature') {
              if (questions.answers != undefined) {
                var tempIds = [];
                var dataArray = [];
                photoIds.push(questions.answers);
                tempIds.push(questions.answers);
                tempIds.map(dataId => {
                  dataArray.push({ file_id: questions.answers });
                });
                installer_answers_photos.push({
                  question_order_id: questions.order,
                  data: dataArray
                });
              }
            } else {
              var tempIds = [];
              var dataArray = [];
              if (questions.photo != undefined) {
                questions.photo.map(item => {
                  photoIds.push(item);
                  tempIds.push(item);
                });
                tempIds.map(dataId => {
                  dataArray.push({ file_id: dataId });
                });
                installer_answers_photos.push({
                  question_order_id: questions.order,
                  data: dataArray
                });
              }
            }
          });

          if (photoIds.length != 0) {
            await apiGet(`files?search={"id":[` + photoIds + `]}`, this.props.token).then(res => {
              if (res.data) {
                installer_answers_photos.map(questions => {
                  questions.data.map((photo, index) => {
                    res.data.filter(e => {
                      e.id === photo.file_id ? (questions.data[index] = { url: e.s3_location, file_id: e.id }) : [];
                    });
                  });
                });
              }
            });
          }

          this.props.setActivityData({
            ...response.data,
            installer_questions_answers: JSON.parse(response.data.installer_questions_answers),
            installer_questions_photos: installer_answers_photos
          });
          this.props.clearPhotos();
          this.props.setIsloading(false);
        });
      } else {
        this.props.setActivityData(this.props.orderList.filter(order => order.id === this.props.activityId)[0]);
        this.props.setIsloading(false);
      }
    }
  })
)(WorkOrderQuestionsView);
