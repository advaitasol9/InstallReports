import { Alert, AsyncStorage, AppState } from 'react-native';
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
  withState('woAnswersDraftSaved', 'setWOAnswersDraftSaved', false),
  withState('isFormUpdated', 'setIsFormUpdated', false),
  withHandlers({
    validateAnswers: props => calledFromInitWo => {
      const installerQuestions = props.activityData.installer_questions_answers;
      if (!installerQuestions?.length) {
        console.log('a');
        return;
      }
      if (!calledFromInitWo) {
        props.setIsFormUpdated(true);
      }

      for (let i = 0; i < installerQuestions.length; i++) {
        const question = installerQuestions[i];
        if (!question.required) {
          console.log(question.order, 'b');
          continue;
        }

        if (question.type == 'signature' && !props.signature.length && !question.answers) {
          console.log(question.order, 'c');

          props.setIsSubmitBtnDisabled(true);
          return;
        }
        const noNewPhotos = !props.photos.find(p => p.order == question.order);
        const noExistingPhotos = !props.activityData.installer_questions_photos.find(p => p.question_order_id == question.order)?.data?.length;
        if (question.allow_photos && noNewPhotos && noExistingPhotos) {
          console.log(question.order, 'd');

          props.setIsSubmitBtnDisabled(true);
          return;
        }

        if (question.type == 'photo' && noNewPhotos && noExistingPhotos) {
          console.log(question.order, 'e');

          props.setIsSubmitBtnDisabled(true);
          return;
        }

        if (['checklist', 'freeform', 'dropdown'].includes(question.type) && !question.answers?.length) {
          console.log(question.order, 'f');

          props.setIsSubmitBtnDisabled(true);
          return;
        }
      }
      console.log('g');

      props.setIsSubmitBtnDisabled(false);
    },
    clearWorkOrderAnswersDraft: props => async () => {
      const workOrderAnswersDraft = JSON.stringify({
        installer_questions_answers: null,
        questionsPhotos: null,
        questionsPhotosToDelete: null
      });
      console.log('workorder on Blur', workOrderAnswersDraft);
      try {
        const existingWorkOrderDraft = await AsyncStorage.getItem(JSON.stringify(props.activityId));
        if (existingWorkOrderDraft) {
          AsyncStorage.mergeItem(JSON.stringify(props.activityId), workOrderAnswersDraft, err => {
            console.log('written to storage successfully');
            if (!err) {
              console.log('photos cleared');
              props.addPhoto([]);
              props.setWOAnswersDraftSaved(true);
              props.setIsFormUpdated(false);
            }
          });
        } else {
          AsyncStorage.setItem(JSON.stringify(props.activityId), workOrderAnswersDraft, err => {
            console.log('written to storage successfully');
            if (!err) {
              console.log('photos cleared');
              props.addPhoto([]);
              props.setWOAnswersDraftSaved(true);
              props.setIsFormUpdated(false);
            }
          });
        }
      } catch (error) {
        console.log('error while saving installer answers draft', error);
      }
    },
    saveWorkOrderAnswersDraft: props => async () => {
      if (!props.isFormUpdated) {
        return;
      }
      const workOrderAnswersDraft = JSON.stringify({
        installer_questions_answers: props.activityData.installer_questions_answers,
        questionsPhotos: props.photos,
        questionsPhotosToDelete: props.photosToDelete
      });
      console.log('workorder on Blur', workOrderAnswersDraft);
      try {
        const existingWorkOrderDraft = await AsyncStorage.getItem(JSON.stringify(props.activityId));
        if (existingWorkOrderDraft) {
          AsyncStorage.mergeItem(JSON.stringify(props.activityId), workOrderAnswersDraft, err => {
            console.log('written to storage successfully');
            if (!err) {
              console.log('photos cleared');
              props.addPhoto([]);
              props.setWOAnswersDraftSaved(true);
              props.setIsFormUpdated(false);
            }
          });
        } else {
          AsyncStorage.setItem(JSON.stringify(props.activityId), workOrderAnswersDraft, err => {
            console.log('written to storage successfully');
            if (!err) {
              console.log('photos cleared');
              props.addPhoto([]);
              props.setWOAnswersDraftSaved(true);
              props.setIsFormUpdated(false);
            }
          });
        }
      } catch (error) {
        console.log('error while saving manager asnwers draft', error);
      }
    }
  }),
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
      try {
        const payload = {
          photos: props.photos,
          answers: props.activityData.installer_questions_answers,
          signature: props.signature[0],
          deleted_photos: props.photosToDelete
        };

        if (!props.connectionStatus) {
          const changes = [{ type: 'question_answer_update', payload: payload }];
          props.saveOfflineChanges(props.activityData.id, changes);
        } else {
          const { photos, answers } = await props.updateWorkOrderQuestionAnswers(props.activityData.id, payload, props.token);

          const quetsionPhotos = answers.map(answer => {
            const newPhotos = photos
              .filter(photo => photo.order == answer.order)
              .map(item => {
                return { file_id: item.id, url: item.s3_location };
              });
            const answerPhotos = props.activityData.installer_questions_photos.find(photo => photo.question_order_id == answer.order);
            return { ...answerPhotos, data: [...(answerPhotos?.data ?? []), ...newPhotos] };
          });

          props.setActivityData({ ...props.activityData, installer_questions_photos: quetsionPhotos, installer_questions_answers: answers });
          props.clearPhotos();
        }

        props.setIsSubmitLoading(false);
        props.setSignature([]);
        props.clearWorkOrderAnswersDraft();
        Alert.alert('Success', 'Your answer(s) have been received.', [{ text: 'Ok' }]);
      } catch (e) {
        console.log(e);
        props.setIsSubmitLoading(false);
      }
    },
    updateQuestionAnswers: props => async () => {
      props.setIsUpdateLoading(true);
      try {
        const payload = {
          photos: props.photos,
          answers: props.activityData.installer_questions_answers,
          signature: props.signature[0],
          deleted_photos: props.photosToDelete
        };

        if (!props.connectionStatus) {
          const changes = [{ type: 'question_answer_update', payload: payload }];
          props.saveOfflineChanges(props.activityData.id, changes);
        } else {
          const { photos, answers } = await props.updateWorkOrderQuestionAnswers(props.activityData.id, payload, props.token);

          const quetsionPhotos = answers.map(answer => {
            const newPhotos = photos
              .filter(photo => photo.order == answer.order)
              .map(item => {
                return { file_id: item.id, url: item.s3_location };
              });
            const answerPhotos = props.activityData.installer_questions_photos.find(photo => photo.question_order_id == answer.order);
            return { ...answerPhotos, data: [...(answerPhotos?.data ?? []), ...newPhotos] };
          });

          props.setActivityData({ ...props.activityData, installer_questions_photos: quetsionPhotos, installer_questions_answers: answers });
          props.clearPhotos();
        }

        props.setIsUpdateLoading(false);
        props.setSignature([]);
        Alert.alert('Success', 'Your answer(s) have been updated.', [{ text: 'Ok' }]);
      } catch (e) {
        console.log(e);
        props.setIsUpdateLoading(false);
      }
    },
    initWOQuestions: props => async () => {
      let workOrder;
      let preInstallCompleted = false;

      const workOrderAnswersDraft = await AsyncStorage.getItem(JSON.stringify(props.activityId), err => {
        console.log('error while fetching draft ', err);
      });
      console.log('current wooorkorder', workOrderAnswersDraft);

      if (props.connectionStatus) {
        const response = await apiGetJson(`activities/${props.activityId}?with=["items"]`, props.token);
        workOrder = response.data;
      } else {
        workOrder = props.offlineWorkOrders[props.activityId];
      }

      if (workOrderAnswersDraft !== null) {
        console.log('pass');
        const workOrderObj = JSON.parse(workOrderAnswersDraft);
        if (workOrderObj?.installer_questions_answers) {
          if (workOrderObj?.questionsPhotosToDelete?.length > 0) {
            const answers = workOrderObj.installer_questions_answers.map(question => {
              if (question.type == 'photo') {
                workOrderObj.questionsPhotosToDelete.forEach(photo => {
                  const index = question.answers.indexOf(photo);
                  if (index != -1) {
                    question.answers.splice(index, 1);
                  }
                });
              } else if (question.allow_photos) {
                workOrderObj.questionsPhotosToDelete.forEach(photo => {
                  const index = question.photo.indexOf(photo);
                  if (index != -1) {
                    question.photo.splice(index, 1);
                  }
                });
              }
              return question;
            });
            props.setPhotosToDelete([]);
            workOrder.installer_questions_answers = JSON.stringify(answers);
          } else {
            workOrder.installer_questions_answers = JSON.stringify(workOrderObj.installer_questions_answers);
          }
        }
        if (workOrderObj?.questionsPhotos) {
          if (props.photos.length != 0) {
            console.log('photos present');
            const tempPhotos = [];
            workOrderObj.questionsPhotos.forEach(photo => {
              const alreadyPresent = props.photos.find(propPhoto => propPhoto.uri === photo.uri) !== undefined ? true : false;
              if (!alreadyPresent) {
                tempPhotos.push(photo);
              }
            });
            props.addPhoto([...props.photos, ...tempPhotos]);
          } else {
            console.log('no photos');
            props.addPhoto(workOrderObj.questionsPhotos);
          }
        }
      }

      console.log('after workorder', workOrder);

      if (!workOrder) {
        props.setActivityData(workOrder);
        props.setIsLoading(false);
      }

      if (workOrder.status == 'In_Progress') {
        preInstallCompleted = true;
      }

      let installerQuestions = JSON.parse(workOrder.installer_questions_answers) ?? [];

      console.log('installerQuestion', installerQuestions);

      let installerPhotoIds = [];
      let installerAnswersPhotos = [];

      const workOrderChanges = props.offlineChanges[props.activityId] ?? [];

      const stateChanges = workOrderChanges.filter(item => item.type == 'status');
      const answerChanges = workOrderChanges.filter(item => item.type == 'question_answer_update');

      if (stateChanges[stateChanges.length - 1]?.payload == 'In_Progress') {
        preInstallCompleted = true;
      }

      if (answerChanges.length) {
        let { photos, answers, signature, deleted_photos } = answerChanges[answerChanges.length - 1].payload;

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
      }

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
        console.log('installerPhotoIds', installerPhotoIds);
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

      await props.setActivityData({
        ...workOrder,
        installer_questions_answers: installerQuestions,
        installer_questions_photos: installerAnswersPhotos
      });

      props.validateAnswers(true);
      props.setIsLoading(false);
    }
  }),
  lifecycle({
    async componentWillMount() {
      this._unsubscribe = this.props.navigation.addListener('didFocus', async e => {
        // this.props.addPhoto([]);
        await this.props.initWOQuestions();
      });
      this._blurUnsub = this.props.navigation.addListener('willBlur', async e => {
        this.props.saveWorkOrderAnswersDraft();
      });
    },
    componentDidMount() {
      console.log('activityId', this.props.activityId);
      this._appStateListener = AppState.addEventListener('change', nextState => {
        if (nextState !== 'active') {
          this.props.saveWorkOrderAnswersDraft();
        } else if (nextState === 'active') {
          this.props.initWOQuestions();
        }
      });
    },
    componentWillUnmount() {
      this.props.clearPhotos();
      if (!this.props.workOrderAnswersDraftSaved) {
        this.props.saveWorkOrderAnswersDraft();
      }
      this._unsubscribe.remove();
      this._blurUnsub.remove();
      // this._appStateListener.remove();
    }
  })
)(WorkOrderQuestionsView);
