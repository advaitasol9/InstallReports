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
import { Alert, AsyncStorage, AppState } from 'react-native';

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
  withState('didUserCloseModal', 'setDidUserCloseModal', false),
  withState('update', 'setUpdate', true),
  withState('geoLocation', 'setLatLng', { lat: '', lon: '' }),
  withState('answersValid', 'setAnswersValid', true),
  withState('submitButtonLoading', 'setSubmitButtonLoading', false),
  withState('isFormUpdated', 'setIsFormUpdated', false),
  withState('errorWhileInit', 'setErrorWhileInit', false),

  withHandlers({
    validateAnswers: props => calledFromInitWo => {
      if (!calledFromInitWo) {
        props.setIsFormUpdated(true);
      }
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
    clearWorkOrderAnswersDraft: props => async () => {
      AsyncStorage.removeItem(JSON.stringify(props.activityId), err => {
        console.log('clearing WO draft', err);
        if (err === null) {
          props.setIsFormUpdated(false);
        }
      });
    },
    saveWorkOrderAnswersDraft: props => async () => {
      if (!props.isFormUpdated) {
        return;
      }
      const workOrderAnswersDraft = JSON.stringify({
        manager_questions_answers: props.activityData.manager_questions_answers,
        managerPhotos: props.photos
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
              props.setIsFormUpdated(false);
            }
          });
        } else {
          AsyncStorage.setItem(JSON.stringify(props.activityId), workOrderAnswersDraft, err => {
            console.log('written to storage successfully');
            if (!err) {
              console.log('photos cleared');
              props.addPhoto([]);
              props.setIsFormUpdated(false);
            }
          });
        }
      } catch (error) {
        console.log('error while saving manager answers draft', error);
      }
    }
  }),
  withHandlers({
    initWorkOrder: props => async () => {
      try {
        let workOrder;
        console.log(0);
        // if (!props.isLoading) {
        //   props.setIsloading(true);
        // }
        if (props.didUserCloseModal) {
          props.setDidUserCloseModal(false);
          props.setIsloading(true);
        }
        if (props.connectionStatus) {
          const search = `&search={"fields":[{"operator":"equals","value":${props.activityId},"field":"id"}]}`;
          const response = await apiGetJson(`spectrum/activities?with=["items"]` + search, props.token);
          workOrder = response.data[0];
        } else {
          workOrder = props.offlineWorkOrders[props.activityId];
        }
        console.log(1);
        var installerAnswers = [];

        installerAnswers = JSON.parse(workOrder.installer_questions_answers);

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
              props.setIsloading(false);

              return;
            }
            const noNewPhotos = !photos.find(p => p.order == question.order);
            const noExistingPhotos = !question.photo || !question.photo.find(p => !deleted_photos.includes(p));
            if (question.allow_photos && noNewPhotos && noExistingPhotos) {
              props.setIsIncompleteOpen(true);
              props.setIsloading(false);

              return;
            }

            if (question.type == 'photo' && noNewPhotos && !question.answers.find(p => !deleted_photos.includes(p))) {
              props.setIsIncompleteOpen(true);
              props.setIsloading(false);

              return;
            }

            if (['checklist', 'freeform', 'dropdown'].includes(question.type) && !question.answers?.length) {
              props.setIsIncompleteOpen(true);
              props.setIsloading(false);

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
                  props.setIsloading(false);

                  return;
                }
                if (question.answers == undefined || question.answers == '' || question.answers?.length == 0) {
                  props.setIsIncompleteOpen(true);
                  props.setIsloading(false);

                  return;
                }
              } else if (question.type == 'photo') {
                if (question.answers == undefined || !question.answers.length) {
                  props.setIsIncompleteOpen(true);
                  props.setIsloading(false);

                  return;
                }
              } else if (question.type == 'signature') {
                if ((question.answers = undefined || question.answers == null)) {
                  props.setIsIncompleteOpen(true);
                  props.setIsloading(false);

                  return;
                }
              }
            }
          }
        }

        const workOrderAnswersDraft = await AsyncStorage.getItem(JSON.stringify(props.activityId), err => {
          console.log('error while fetching draft ', err);
        });
        console.log('current wooorkorder', workOrderAnswersDraft);

        if (workOrderAnswersDraft !== null) {
          console.log('pass');
          const workOrderObj = JSON.parse(workOrderAnswersDraft);
          if (workOrderObj?.manager_questions_answers) {
            workOrder.manager_questions_answers = JSON.stringify(workOrderObj.manager_questions_answers);
          }
          if (workOrderObj?.managerPhotos) {
            if (props.photos.length != 0) {
              console.log('photos present');
              const tempPhotos = [];
              workOrderObj.managerPhotos.forEach(photo => {
                const alreadyPresent = props.photos.find(propPhoto => propPhoto.uri === photo.uri) !== undefined ? true : false;
                if (!alreadyPresent) {
                  tempPhotos.push(photo);
                }
              });
              props.addPhoto([...props.photos, ...tempPhotos]);
            } else {
              console.log('no photos');
              props.addPhoto(workOrderObj.managerPhotos);
            }
          }
        }

        console.log('after workorder', workOrder);

        let photoIds = [];
        const managerQuestions = JSON.parse(workOrder.manager_questions_answers) ?? [];

        console.log('managerQuestions', managerQuestions);

        const managerQuestionsPhotos = managerQuestions.map(question => {
          let photos;
          if (question.type == 'photo') {
            photos = question.answers;
          } else if (question.type == 'signature') {
            if (question.answers && question.answers != '') {
              photos = [question.answers];
            }
          } else if (question.allow_photos) {
            photos = question.photos;
          }
          console.log('photos', photos);
          photoIds = [...photoIds, ...(photos ?? [])]; //photos should be expanded

          photos = (photos ?? []).map(photo => {
            const localPath = props.offlinePhotos[photo]?.local_path;
            return { file_id: photo, url: localPath };
          });

          return { question_order_id: question.order, data: photos };
        });
        console.log(2);

        if (props.connectionStatus && photoIds.length != 0) {
          console.log(2.1, photoIds);
          const res = await apiGet(`files?search={"id":` + photoIds + `]}`, props.token);
          console.log(2.2, res);
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

        console.log(3);
        props.setActivityData({
          ...workOrder,
          manager_questions_answers: managerQuestions,
          installer_questions_photos: managerQuestionsPhotos
        });
        console.log(4);
        // props.clearPhotos();
        props.validateAnswers(true);
        props.setIsloading(false);
      } catch (error) {
        console.log('error in manager initWO', error);
        props.setIsloading(false);
        props.setErrorWhileInit(true);
      }
    },

    onSubmit: props => async () => {
      props.setSubmitButtonLoading(true);
      var statusValue = 'Complete';
      if (props.connectionStatus) {
        if (props.activityData.items.length > 0) {
          if (props.activityData.items[0].is_immediate_client_review == 1) {
            statusValue = 'Client_Review';
          }
        }
      } else {
        var WO = props.offlineWorkOrders[props.activityId];
        if (WO.items.length > 0) {
          if (WO.items[0].is_immediate_client_review == 1) {
            statusValue = 'Client_Review';
          }
        }
      }
      try {
        if (props.connectionStatus) {
          await props.updateMangerAnswers(
            props.activityId,
            { answers: props.activityData.manager_questions_answers, photos: props.photos, signature: props.signature[0] },
            props.token
          );

          await props.updateWorkOrderStatus(props.activityId, statusValue, props.token);

          await props.updateWorkOrderGeoLocation(props.activityId, { complete: props.geoLocation }, props.token);
        } else {
          const changes = [
            {
              type: 'manager_questions_save',
              payload: { answers: props.activityData.manager_questions_answers, photos: props.photos, signature: props.signature[0] }
            },
            { type: 'status', payload: statusValue },
            { type: 'geo_locations', payload: { complete: props.geoLocation } }
          ];

          props.saveOfflineChanges(props.activityId, changes);
        }
        props.setSubmitButtonLoading(false);
        props.clearPhotos();
        props.setSignature([]);
        props.clearWorkOrderAnswersDraft();
        props.showWOCompleteModal(true);
      } catch (e) {
        console.log(e);
        props.setSubmitButtonLoading(false);
      }
    }
  }),
  lifecycle({
    async componentWillMount() {
      this._unsubscribe = this.props.navigation.addListener('willFocus', async e => {
        this.props.setIsloading(true);
        await this.props.initWorkOrder();
      });
      this._blurUnsub = this.props.navigation.addListener('willBlur', async e => {
        this.props.saveWorkOrderAnswersDraft();
      });
    },
    componentDidMount() {
      this._appStateListener = AppState.addEventListener('change', nextState => {
        if (nextState !== 'active') {
          this.props.saveWorkOrderAnswersDraft();
        } else if (nextState === 'active') {
          this.props.setIsloading(true);
          this.props.initWorkOrder();
        }
      });
    },
    async componentWillUnmount() {
      this.props.saveWorkOrderAnswersDraft();
      this._unsubscribe.remove();
      this._blurUnsub.remove();
    }
  })
)(WorkOrderManagerView);
