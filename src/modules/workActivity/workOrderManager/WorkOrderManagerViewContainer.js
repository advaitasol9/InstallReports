// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson, apiGet } from '../../../core/api';
import WorkOrderManagerView from './WorkOrderManagerView';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { setManagerModalVisible, setIncompleteModalVisible } from '../../AppState';
import { addManagerPhoto, clearPhotos } from '../workOrderQuestions/WorkOrderQuestionsState';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      photos: state.workOrderQuestion.managerPhotos
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setManagerModalVisible(payload)),
      setIncompleteModalVisible: payload => dispatch(setIncompleteModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addManagerPhoto(arr)),
      clearPhotos: () => dispatch(clearPhotos())
    })
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('signature', 'setSignature', []),
  withState('isLoading', 'setIsloading', true),
  withState('isQuestionsAnswered', 'setIsQuestionsAnswered', true),
  withState('isIncompleteOpen', 'setIsIncompleteOpen', false),
  withState('update', 'setUpdate', true),
  withState('photos', 'addPhotos', []),
  withState('geoLocation', 'setLatLng', { lat: '', lon: '' }),
  lifecycle({
    componentWillMount() {
      if (this.props.connectionStatus) {
        apiGetJson(`activities/${this.props.activityId}?with=["items"]`, this.props.token).then(async response => {
          const installerAnswers = JSON.parse(response.data.installer_questions_answers);

          var photoIds = [];
          var manager_answers_photos = [];

          JSON.parse(response.data.manager_questions_answers).map(questions => {
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
                manager_answers_photos.push({
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
                manager_answers_photos.push({
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
                manager_answers_photos.push({
                  question_order_id: questions.order,
                  data: dataArray
                });
              }
            }
          });

          if (photoIds.length != 0) {
            await apiGet(`files?search={"id":[` + photoIds + `]}`, this.props.token).then(res => {
              if (res.data) {
                manager_answers_photos.map(questions => {
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
            manager_questions_answers: JSON.parse(response.data.manager_questions_answers),
            installer_questions_photos: manager_answers_photos
          });

          this.props.clearPhotos();
          this.props.setIsloading(false);
          installerAnswers.map(question => {
            if (question.required) {
              if (['checklist', 'freeform', 'dropdown'].includes(question.type)) {
                if (question.allow_photos && !(question.photo != undefined ? question.photo.length > 0 : false)) {
                  this.props.setIsIncompleteOpen(true);
                } else if (question.answers == '') {
                  this.props.setIsIncompleteOpen(true);
                }
              } else if (question.type == 'photo') {
                if (!(question.answers != undefined ? question.answers.length > 0 : false)) {
                  this.props.setIsIncompleteOpen(true);
                }
              } else if (question.type == 'signature') {
                console.log(question);
                if (!(question.answers != undefined ? question.answers != null : false)) {
                  this.props.setIsIncompleteOpen(true);
                } else {
                }
              }
            }
          });
        });
      } else {
        this.props.setActivityData(this.props.orderList.filter(order => order.id === this.props.activityId)[0]);
        this.props.setIsloading(false);
      }
    }
  })
)(WorkOrderManagerView);
