import { BackHandler } from 'react-native';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { saveWorkOrderFailedAttempts } from '../../../../redux/actions/workOrderFailedAttemptActions';
import { updateWorkOrderStatus } from '../../../../redux/actions/workOrderPreInsallActions';
import { setFailedModalVisible } from '../../../AppState';
import { addOfflineWorkorderChanges } from '../../../offlineWorkorderState';
import { setActivityId } from '../../../workOrder/WorkOrderState';
import { addFailPhoto } from './DetailFailState';
import DetailFailView from './DetailFailView';

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
    path: 'Install Reports'
  }
};

export default compose(
  connect(
    state => ({
      accountId: state.profile.user.id,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      photos: state.detailFail.photos,
      userRole: state.profile.user_roles[0].name
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setFailedModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addFailPhoto(arr)),
      addOfflineChanges: (workOrderId, changes) => dispatch(addOfflineWorkorderChanges({ workOrderId, changes })),
      updateStatus: (workOrderId, status, token) => dispatch(updateWorkOrderStatus(workOrderId, status, token)),
      saveComment: (workOrderId, payload, token) => dispatch(saveWorkOrderFailedAttempts(workOrderId, payload, token))
    })
  ),
  withState('comment', 'setComment', ''),
  withState('signature', 'setSignature', []),
  withState('name', 'setName', ''),
  withState('confirmModalOpened', 'setConfirmModalOpened', false),
  withState('isSubmitLoading', 'setIsSubmitLoading', false),
  withHandlers({
    openImageSelector: props => () => {
      Alert.alert(
        'Add photo',
        '',
        [
          {
            text: 'Choose from gallery',
            onPress: () => {
              ImagePicker.launchImageLibrary(options, response => {
                if (!response.didCancel) {
                  props.addPhoto([...props.photos, response.uri]);
                }
              });
            }
          },
          {
            text: 'Take a photo',
            onPress: () => {
              ImagePicker.launchCamera(options, response => {
                const { photos } = props;
                if (!response.didCancel) {
                  props.addPhoto([...props.photos, response.uri]);
                }
              });
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    },
    cancel: props => () => {
      props.addPhoto([]);
      props.setSignature([]);
      props.navigation.navigate('DetailsMain');
    },
    saveFailedDetails: props => async () => {
      props.setIsSubmitLoading(true);
      try {
        const data = `text=${props.comment}&user_id=%5B${props.accountId}%5D&channel=${props.userRole}`;
        if (!props.connectionStatus) {
          const changes = [
            {
              type: 'failed_attempt_save',
              payload: {
                comment: data,
                photos: props.photos,
                signature: props.signature[0],
                manager_name: props.name
              }
            },
            { type: 'status', payload: 'Failed' }
          ];
          props.addOfflineChanges(props.activityId, changes);
        } else {
          await props.saveComment(
            props.activityId,
            { comment: data, photos: props.photos, signature: props.signature[0], manager_name: props.name },
            props.token
          );
          await props.updateStatus(props.activityId, 'Failed', props.token);
        }
        props.setIsSubmitLoading(false);
        props.setSignature([]);
        props.addPhoto([]);
        props.setConfirmModalOpened(false);
        props.navigation.navigate('Work Order');
      } catch (e) {
        console.log(e);
        props.setIsSubmitLoading(false);
        props.setConfirmModalOpened(false);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      this.handleBackButtonClick = () => {
        this.props.cancel();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

      if (this.props.navigation.state.params && this.props.navigation.state.params.screenData.text) {
        this.props.setComment(this.props.navigation.state.params.screenData.text);
      }
    },
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPr,yess', this.handleBackButtonClick);
    }
  })
)(DetailFailView);
