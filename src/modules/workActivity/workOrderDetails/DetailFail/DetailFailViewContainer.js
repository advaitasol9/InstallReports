import {
  compose, withState, lifecycle,
} from 'recompose';
import { connect } from 'react-redux';
import { addFailPhoto } from './DetailFailState';

import { setChanges, setActivityId } from '../../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../../core/api';
import { setFailedModalVisible } from '../../../AppState';

import DetailFailView from './DetailFailView';

export default compose(
  connect(
    state => ({
      accountId: state.profile.user.id,
      changes: state.workOrder.changesInOffline,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      photos: state.detailFail.photos,
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
      setModalVisible: payload => dispatch(setFailedModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addFailPhoto(arr)),
    }),
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('comment', 'setComment', ''),
  lifecycle({
    componentDidMount() {
      console.log(this.props);
      this.props.setNumOfChanges(this.props.changes.length);

      if (this.props.navigation.state.params
        && this.props.navigation.state.params.screenData.text) {
        this.props.setComment(this.props.navigation.state.params.screenData.text);
      }

      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(DetailFailView);
