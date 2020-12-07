// @flow
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { apiGet, apiGetJson } from '../../../core/api';
import { saveManagerQuestionAnswers } from '../../../redux/actions/workOrderManagerActions';
import { updateWorkOrderGeoLocation, updateWorkOrderStatus } from '../../../redux/actions/workOrderPreInsallActions';
import { setIncompleteModalVisible, setManagerModalVisible } from '../../AppState';
import { addOfflineWorkorderChanges } from '../../offlineWorkorderState';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { addManagerPhoto, clearPhotos } from '../workOrderQuestions/WorkOrderQuestionsState';
import WorkOrderManagerView from './WorkOrderManagerView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      photos: state.workOrderQuestion.managerPhotos,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      offlinePhotos: state.offlineWorkOrder.photos,
      offlineChanges: state.offlineWorkOrder.workOrderChanges
    }),
    dispatch => ({
      showWOCompleteModal: payload => dispatch(setManagerModalVisible(payload)),
      setIncompleteModalVisible: payload => dispatch(setIncompleteModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addManagerPhoto(arr)),
      clearPhotos: () => dispatch(clearPhotos()),
      updateMangerAnswers: (id, answerData, token) => dispatch(saveManagerQuestionAnswers(id, answerData, token)),
      updateWorkOrderStatus: (id, status, token) => dispatch(updateWorkOrderStatus(id, status, token)),
      updateWorkOrderGeoLocation: (id, geoLocation, token) => dispatch(updateWorkOrderGeoLocation(id, geoLocation, token)),
      saveOfflineChanges: (workOrderId, changes) => dispatch(addOfflineWorkorderChanges({ workOrderId, changes }))
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
  withState('answersValid', 'setAnswersValid', true),
  withState('submitButtonLoading', 'setSubmitButtonLoading', false),

  withHandlers({
    validateAnswers: props => () => {
      const managerQuestions = props.activityData.manager_questions_answers;

      for (let i = 0; i < managerQuestions.length; i++) {
        const question = managerQuestions[i];

        if (question.required) {
          if (question.type === 'signature' && props.signature.length == 0) {
            props.setAnswersValid(true);
            return;
          }
          if (question.allow_photos && props.photos.filter(photo => photo.order == question.order).length == 0) {
            props.setAnswersValid(true);
            return;
          }
          if (question.type === 'photo' && props.photos.filter(photo => photo.order == question.order).length == 0) {
            props.setAnswersValid(true);
            return;
          }
          if (['checklist', 'freeform', 'dropdown'].includes(question.type)) {
            if (!question.answers || question.answers == '' || question.answers.length == 0) {
              props.setAnswersValid(true);
              return;
            } else if (question.allow_photos && props.photos.filter(photo => photo.order == question.order).length == 0) {
              props.setAnswersValid(true);
              return;
            }
          }
        }
      }
      props.setAnswersValid(false);
    },

    initWorkOrder: props => async () => {
      let workOrder;

      if (props.connectionStatus) {
        const response = await apiGetJson(`activities/${props.activityId}?with=["items"]`, props.token);
        workOrder = response.data;
      } else {
        workOrder = props.offlineWorkOrders[props.activityId];
      }

      var installerAnswers = [];

      installerAnswers = JSON.parse(workOrder.installer_questions_answers);

      let photoIds = [];
      const managerQuestions = JSON.parse(workOrder.manager_questions_answers) ?? [];

      const managerQuestionsPhotos = managerQuestions.map(question => {
        let photos;
        if (question.type == 'photo') {
          photos = question.answers;
        } else if (question.type == 'signature') {
          photos = [question.answers];
        } else if (question.allow_photos) {
          photos = question.photos;
        }

        photoIds = [...photoIds, photos ?? []];

        photos = (photos ?? []).map(photo => {
          const localPath = props.offlinePhotos[photo]?.local_path;
          return { file_id: photo, url: localPath };
        });

        return { question_order_id: question.order, data: photos };
      });

      if (props.connectionStatus && photoIds.length != 0) {
        const res = await apiGet(`files?search={"id":` + photoIds + `]}`, props.token);
        if (res.data) {
          managerQuestionPhotos = managerQuestionsPhotos.map(questions => {
            const data = questions.data.map((photo, index) => {
              res.data.filter(e => {
                e.id === photo.file_id ? (questions.data[index] = { url: e.s3_location, file_id: e.id }) : [];
              });
            });

            return { ...questions, data };
          });
        }
      }

      props.setActivityData({
        ...workOrder,
        manager_questions_answers: managerQuestions,
        installer_questions_photos: managerQuestionsPhotos
      });

      props.clearPhotos();

      const offlineChanges = props.offlineChanges[props.activityId];

      const questionAnswerChanges = (offlineChanges ?? []).filter(change => change.type == 'question_answer_update');

      if (questionAnswerChanges.length) {
        const { answers, photos, signature, deleted_photos } = questionAnswerChanges[questionAnswerChanges.length - 1].payload;

        for (const question of answers) {
          if (!question.required) {
            continue;
          }

          if (question.type == 'signature' && !signature.length && !question.answers) {
            props.setIsIncompleteOpen(true);
            return;
          }
          const noNewPhotos = !photos.find(p => p.order == question.order);
          const noExistingPhotos = !question.photo || !question.photo.find(p => !deleted_photos.includes(p));
          if (question.allow_photos && noNewPhotos && noExistingPhotos) {
            props.setIsIncompleteOpen(true);
            return;
          }

          if (question.type == 'photo' && noNewPhotos && !question.answers.find(p => !deleted_photos.includes(p))) {
            props.setIsIncompleteOpen(true);
            return;
          }

          if (['checklist', 'freeform', 'dropdown'].includes(question.type) && !question.answers?.length) {
            props.setIsIncompleteOpen(true);
            return;
          }
        }
      } else {
        for (let i = 0; i < installerAnswers.length; i++) {
          const question = installerAnswers[i];
          if (question.required) {
            if (['checklist', 'freeform', 'dropdown'].includes(question.type)) {
              if (question.allow_photos && (question.photo == undefined || !question.photo.length)) {
                props.setIsIncompleteOpen(true);
                return;
              }
              if (question.answers == undefined) {
                props.setIsIncompleteOpen(true);
                return;
              }
              if (question.answers == '') {
                props.setIsIncompleteOpen(true);
                return;
              }
            } else if (question.type == 'photo') {
              if (question.answers == undefined || !question.answers.length) {
                props.setIsIncompleteOpen(true);
                return;
              }
            } else if (question.type == 'signature') {
              if ((question.answers = undefined || question.answers == null)) {
                props.setIsIncompleteOpen(true);
                return;
              }
            }
          }
        }
      }
    },

    onSubmit: props => async () => {
      props.setSubmitButtonLoading(true);

      try {
        if (props.connectionStatus) {
          await props.updateMangerAnswers(
            props.activityId,
            { answers: props.activityData.manager_questions_answers, photos: props.photos, signature: props.signature[0] },
            props.token
          );

          await props.updateWorkOrderStatus(props.activityId, 'Complete', props.token);

          await props.updateWorkOrderGeoLocation(props.activityId, { complete: props.geoLocation }, props.token);
        } else {
          const changes = [
            {
              type: 'manager_questions_save',
              payload: { answers: props.activityData.manager_questions_answers, photos: props.photos, signature: props.signature[0] }
            },
            { type: 'status', payload: 'Complete' },
            { type: 'geo_locations', payload: { complete: props.geoLocation } }
          ];

          props.saveOfflineChanges(props.activityId, changes);
        }
        props.setSubmitButtonLoading(false);
        props.clearPhotos();
        props.setSignature([]);
        props.showWOCompleteModal(true);
      } catch (e) {
        console.log(e);
        props.setSubmitButtonLoading(false);
      }
    }
  }),
  lifecycle({
    async componentWillMount() {
      await this.props.initWorkOrder();
      this.props.setIsloading(false);
    }
  })
)(WorkOrderManagerView);
