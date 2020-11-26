import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { apiGet, apiGetJson } from '../../../core/api';
import { updateWorkOrderQuestionAnswers } from '../../../redux/actions/workOrderQuestionsActions';
import { addOfflineWorkorderChanges } from '../../offlineWorkorderState';
import { setActivityId, setChanges } from '../../workOrder/WorkOrderState';
import { addQuestionPhoto, clearPhotos } from './WorkOrderQuestionsState';
import WorkOrderQuestionsView from './WorkOrderQuestionsView';

export default compose(
  connect(
    state => ({
      offlineChanges: state.offlineWorkOrder.workOrderChanges,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      photos: state.workOrderQuestion.questionsPhotos,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      offlinePhotos: state.offlineWorkOrder.photos,
      workOrderList: state.workOrder.orderList
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addQuestionPhoto(arr)),
      clearPhotos: () => dispatch(clearPhotos()),
      setChanges: arr => dispatch(setChanges(arr)),
      saveOfflineChanges: (workOrderId, changes) => dispatch(addOfflineWorkorderChanges({ workOrderId, changes })),
      updateWorkOrderQuestionAnswers: (id, answerData, token) => dispatch(updateWorkOrderQuestionAnswers(id, answerData, token))
    })
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('isLoading', 'setIsLoading', true),
  withState('update', 'setUpdate', true),
  withState('signature', 'setSignature', []),
  withState('photosToDelete', 'setPhotosToDelete', []),
  withState('isUpdateLoading', 'setIsUpdateLoading', false),
  withState('isSubmitLoading', 'setIsSubmitLoading', false),
  withState('isSubmitBtnDisabled', 'setIsSubmitBtnDisabled', false),
  withHandlers({
    deletePhotos: props => photo => {
      const photos = props.activityData.installer_questions_photos.map(item => {
        const index = item.data.findIndex(obj => obj.file_id == photo.file_id);
        if (index != -1) {
          item.data.splice(index, 1);
        }
        return item;
      });

      props.setActivityData({ ...props.activityData, installer_answers_photos: photos });
      props.setPhotosToDelete([...props.photosToDelete, photo.file_id]);
    },
    submitQuestionAnswers: props => async () => {
      props.setIsSubmitLoading(true);
      if (!props.connectionStatus) {
        const changes = [
          {
            type: 'question_answer_update',
            payload: {
              photos: props.photos,
              answers: props.activityData.installer_questions_answers,
              signature: props.signature[0],
              deleted_photos: props.photosToDelete
            }
          }
        ];

        props.saveOfflineChanges(props.activityData.id, changes);
        props.setIsSubmitLoading(false);
        props.setSignature([]);
        Alert.alert('Success', 'Your answer(s) have been received.', [{ text: 'Ok' }]);
      } else {
        try {
          await props.updateWorkOrderQuestionAnswers(
            props.activityData.id,
            {
              photos: props.photos,
              answers: props.activityData.installer_questions_answers,
              signature: props.signature[0],
              deleted_photos: props.photosToDelete
            },
            props.token
          );

          props.setSignature([]);
          props.setIsSubmitLoading(false);
          Alert.alert('Success', 'Your answer(s) have been received.', [{ text: 'Ok' }]);
        } catch (e) {
          console.log(e);
          props.setIsSubmitLoading(false);
        }
      }
    },
    updateQuestionAnswers: props => async () => {
      props.setIsUpdateLoading(true);
      if (!props.connectionStatus) {
        const changes = [
          {
            type: 'question_answer_update',
            payload: {
              photos: props.photos,
              answers: props.activityData.installer_questions_answers,
              signature: props.signature[0],
              deleted_photos: props.photosToDelete
            }
          }
        ];
        props.saveOfflineChanges(props.activityData.id, changes);
        props.setIsUpdateLoading(false);
        props.setSignature([]);
        Alert.alert('Success', 'Your answer(s) have been updated.', [{ text: 'Ok' }]);
      } else {
        try {
          await props.updateWorkOrderQuestionAnswers(
            props.activityData.id,
            {
              photos: props.photos,
              answers: props.activityData.installer_questions_answers,
              signature: props.signature[0],
              deleted_photos: props.photosToDelete
            },
            props.token
          );

          props.setSignature([]);
          props.setIsUpdateLoading(false);
          Alert.alert('Success', 'Your answer(s) have been updated.', [{ text: 'Ok' }]);
        } catch (e) {
          console.log(e);
          props.setIsUpdateLoading(false);
        }
      }
    },
    initWOQuestions: props => async () => {
      let workOrder;
      let preInstallCompleted = false;

      if (props.connectionStatus) {
        const response = await apiGetJson(`activities/${props.activityId}?with=["items"]`, props.token);
        workOrder = response.data;
      } else {
        workOrder = props.offlineWorkOrders[props.activityId];
      }

      if (!workOrder) {
        props.setActivityData(workOrder);
        props.setIsLoading(false);
      }

      if (workOrder.status == 'In_Progress') {
        preInstallCompleted = true;
      }

      let installerQuestions = JSON.parse(workOrder.installer_questions_answers) ?? [];

      let installerPhotoIds = [];
      let installerAnswersPhotos = [];

      const workOrderChanges = props.offlineChanges[props.activityId] ?? [];

      workOrderChanges.forEach(change => {
        if (change.type == 'status' && change.payload == 'In_Progress') {
          preInstallCompleted = true;
          return;
        }

        if (change.type != 'question_answer_update') {
          return;
        }

        let { photos, answers, signature, deleted_photos } = change.payload;

        answers = answers.map(question => {
          if (question.type == 'photo') {
            deleted_photos.forEach(photo => {
              const index = question.answers.indexOf(photo);
              if (index != -1) {
                question.answers.splice(index, 1);
              }
            });
          } else if (question.allow_photos) {
            deleted_photos.forEach(photo => {
              const index = question.photo.indexOf(photo);
              if (index != -1) {
                question.photo.splice(index, 1);
              }
            });
          }
          return question;
        });

        const unsavedPhotos = props.photos;

        photos.forEach(photo => {
          const index = unsavedPhotos.indexOf(photo);

          if (index == -1) unsavedPhotos.push(photo);
        });

        props.addPhoto(unsavedPhotos);
        installerQuestions = answers;
      });

      installerQuestions.forEach(question => {
        if (question.type == 'photo') {
          installerPhotoIds = [...installerPhotoIds, ...(question.answers ?? [])];
          installerAnswersPhotos.push({
            question_order_id: question.order,
            data: (question.answers ?? []).map(photo => {
              if (!props.connectionStatus && props.offlinePhotos[photo]) {
                return {
                  file_id: photo,
                  url: (props.offlinePhotos[photo]?.local_path).replace(' ', '%20').replace('undefined', '/storage/emulated/0/Pictures')
                };
              } else {
                return {
                  file_id: photo,
                  url: props.offlinePhotos[photo]?.local_path
                };
              }
            })
          });
          return;
        }
        if (question.type == 'signature') {
          if (!question.answers) {
            return;
          }
          installerPhotoIds.push(question.answers);
          installerAnswersPhotos.push({
            question_order_id: question.order,
            data: [
              {
                file_id: question.answers,
                url: props.offlinePhotos[question.answers]?.local_path
              }
            ]
          });
          return;
        }
        if (question.allow_photos) {
          installerPhotoIds = [...installerPhotoIds, ...(question.photo ?? [])];
          installerAnswersPhotos.push({
            question_order_id: question.order,
            data: (question.photo ?? []).map(photo => {
              if (!props.connectionStatus && props.offlinePhotos[photo]) {
                return {
                  file_id: photo,
                  url: (props.offlinePhotos[photo]?.local_path).replace(' ', '%20').replace('undefined', '/storage/emulated/0/Pictures')
                };
              } else {
                return {
                  file_id: photo,
                  url: props.offlinePhotos[photo]?.local_path
                };
              }
            })
          });
        }
      });

      if (props.connectionStatus && installerPhotoIds.length) {
        const res = await apiGet(`files?search={"id":[` + installerPhotoIds + `]}`, props.token);
        if (res.data) {
          installerAnswersPhotos.map(questions => {
            questions.data.map((photo, index) => {
              res.data.filter(e => {
                e.id === photo.file_id ? (questions.data[index] = { url: e.s3_location, file_id: e.id }) : [];
              });
            });
          });
        }
      }

      if (!preInstallCompleted) {
        return Alert.alert(
          'Pre-Install Incomplete',
          "You must tap the 'Begin Work Order' button and fill out the Pre-Install section before you can access this section.",
          [
            {
              text: 'Ok',
              onPress: () => {
                props.navigation.navigate('Details');
              }
            }
          ]
        );
      }

      props.setActivityData({
        ...workOrder,
        installer_questions_answers: installerQuestions,
        installer_questions_photos: installerAnswersPhotos
      });

      if (installerQuestions?.length) {
        for (let i = 0; i < installerQuestions.length; i++) {
          const question = installerQuestions[i];
          if (question.required) {
            if (question.type == 'signature' && !props.signature?.length && !question.answers) {
              props.setIsSubmitBtnDisabled(true);
            }
            if (question.allow_photos && question.photo?.length == 0) {
              props.setIsSubmitBtnDisabled(true);
            }
            if (question.type == 'photo' && question.photo?.length == 0) {
              props.setIsSubmitBtnDisabled(true);
            }
            if (['checklist', 'freeform', 'dropdown'].includes(question.type) && !question.answers?.length) {
              props.setIsSubmitBtnDisabled(true);
            }
          }
        }
      }

      props.setIsLoading(false);
    }
  }),
  lifecycle({
    async componentWillMount() {
      this._unsubscribe = this.props.navigation.addListener('didFocus', async e => {
        this.props.addPhoto([]);
        await this.props.initWOQuestions();
      });
    },
    componentWillUnmount() {
      this._unsubscribe.remove();
    }
  })
)(WorkOrderQuestionsView);
