import NetInfo from '@react-native-community/netinfo';
import { Platform, StatusBar, UIManager } from 'react-native';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { saveWorkOrderFailedAttempts } from '../redux/actions/workOrderFailedAttemptActions';
import { saveManagerQuestionAnswers } from '../redux/actions/workOrderManagerActions';
import { updateWorkOrderComment, updateWorkOrderGeoLocation, updateWorkOrderStatus } from '../redux/actions/workOrderPreInsallActions';
import { updateWorkOrderQuestionAnswers } from '../redux/actions/workOrderQuestionsActions';
import { setConnection } from './AppState';
import AppView from './AppView';
import { updateOfflineWorkOrderChanges } from './offlineWorkorderState';
import { setChanges } from './workOrder/WorkOrderState';

export default compose(
  connect(
    state => ({
      changes: state.offlineWorkOrder.workOrderChanges,
      token: state.profile.security_token.token
    }),
    dispatch => ({
      setConnection: mode => dispatch(setConnection(mode)),
      setChanges: arr => dispatch(setChanges(arr)),
      updateWorkOrderStatus: (id, status, token) => dispatch(updateWorkOrderStatus(id, status, token)),
      updateWorkOrderGeoLocation: (id, geoLocation, token) => dispatch(updateWorkOrderGeoLocation(id, geoLocation, token)),
      updateWorkOrderComment: (id, comment, token) => dispatch(updateWorkOrderComment(id, comment, token)),
      updateOfflineWorkOrderChanges: changes => dispatch(updateOfflineWorkOrderChanges(changes)),
      updateWorkOrderQuestionAnswers: (id, answerData, token) => dispatch(updateWorkOrderQuestionAnswers(id, answerData, token)),
      updateWorkOrderManagerQuestions: (id, answerData, token) => dispatch(saveManagerQuestionAnswers(id, answerData, token)),
      saveWorkOrderFailedAttempt: (id, payload, token) => dispatch(saveWorkOrderFailedAttempts(id, payload, token))
    })
  ),
  lifecycle({
    componentWillMount() {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-unused-expressions
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    },
    componentDidMount() {
      this.unsubscribe = NetInfo.addEventListener(async state => {
        this.props.setConnection(state.isConnected);
        if (state.isConnected) {
          await Object.keys(this.props.changes).forEach(async id => {
            const changes = this.props.changes[id];
            for (const change of changes) {
              switch (change.type) {
                case 'status':
                  await this.props.updateWorkOrderStatus(id, change.payload, this.props.token);
                  break;

                case 'geo_locations':
                  await this.props.updateWorkOrderGeoLocation(id, change.payload, this.props.token);
                  break;

                case 'comments':
                  await this.props.updateWorkOrderComment(id, change.payload, this.props.token);
                  break;

                case 'question_answer_update':
                  await this.props.updateWorkOrderQuestionAnswers(id, change.payload, this.props.token);
                  break;

                case 'manager_questions_save':
                  await this.props.updateWorkOrderManagerQuestions(id, change.payload, this.props.token);
                  break;

                case 'failed_attempt_save':
                  await this.props.saveWorkOrderFailedAttempt(id, change.payload, this.props.token);
              }
            }
          });

          this.props.updateOfflineWorkOrderChanges([]);
        }
      });
    },
    componentWillUnmount() {
      this.unsubscribe();
    }
  })
)(AppView);
