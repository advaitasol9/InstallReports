import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { apiGetJson } from '../../../../core/api';
import { updateWorkOrderComment, updateWorkOrderGeoLocation, updateWorkOrderStatus } from '../../../../redux/actions/workOrderPreInsallActions';
import { addOfflineWorkorderChanges } from '../../../offlineWorkorderState';
import { setActivityId, setChanges } from '../../../workOrder/WorkOrderState';
import { addPreInstallPhoto } from './DetailPreInstallState';
import DetailPreInstallView from './DetailPreInstallView';

export default compose(
  connect(
    state => ({
      accountId: state.profile.user.id,
      changes: state.workOrder.changesInOffline,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      userRole: state.profile.user_roles[0].name,
      photos: state.detailPreInstall.photos
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addPreInstallPhoto(arr)),
      saveOfflineChanges: (workOrderId, changes) => dispatch(addOfflineWorkorderChanges({ workOrderId, changes })),
      saveToApi: async (id, token, status, geoLoaction, comment) => {
        await dispatch(updateWorkOrderStatus(id, status, token));
        await dispatch(updateWorkOrderGeoLocation(id, geoLoaction, token));
        await dispatch(updateWorkOrderComment(id, comment, token));
      }
    })
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('comment', 'setComment', ''),
  withState('geoLocation', 'setLatLng', { lat: '', lon: '' }),
  withState('isLoading', 'setIsLoading', false),
  withHandlers({
    onSubmit: props => async () => {
      props.setIsLoading(true);
      const data = encodeURI(`text=PRE INSTALL NOTES - ${props.comment}&user_ids=[${props.accountId}]&channel=${props.userRole}`);

      if (!props.connectionStatus) {
        const changes = [
          { type: 'status', payload: 'In_Progress' },
          {
            type: 'geo_locations',
            payload: {
              start: {
                lat: props.geoLocation.lat,
                lon: props.geoLocation.lon
              }
            }
          },
          { type: 'comments', payload: { text: data, photos: props.photos } }
        ];
        await props.saveOfflineChanges(props.activityId, changes);
        props.addPhoto([]);
        props.setIsLoading(false);
        props.navigation.navigate('DetailsMain');
      } else {
        try {
          await props.saveToApi(
            props.activityId,
            props.token,
            'In_Progress',
            {
              start: {
                lat: props.geoLocation.lat,
                lon: props.geoLocation.lon
              }
            },
            { text: data, photos: props.photos }
          );
          props.setIsLoading(false);
          props.addPhoto([]);
          props.navigation.navigate('DetailsMain');
        } catch (err) {
          props.setIsLoading(false);
        }
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.setNumOfChanges(this.props.changes.length);

      if (this.props.navigation.state.params) {
        this.props.setComment(this.props.navigation.state.params.screenData.text);
      }

      apiGetJson(`activities/${this.props.activityId}`, this.props.token).then(response => {
        console.log(response.data);
        this.props.setActivityData(response.data);
      });
    }
  })
)(DetailPreInstallView);
