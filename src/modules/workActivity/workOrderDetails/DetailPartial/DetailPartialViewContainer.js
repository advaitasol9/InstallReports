import {
  compose, withState, lifecycle,
} from 'recompose';
import { connect } from 'react-redux';
import { addPartialPhoto } from './DetailPartialState';

import { setChanges, setActivityId } from '../../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../../core/api';
import { setPartModalVisible } from '../../../AppState';

import DetailPartialView from './DetailPartialView';

export default compose(
  connect(
    state => ({
      accountId: state.profile.user.id,
      changes: state.workOrder.changesInOffline,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      photos: state.detailPartial.photos,
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
      setModalVisible: payload => dispatch(setPartModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addPartialPhoto(arr)),
    }),
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('name', 'setName', ''),
  withState('signature', 'setSignature', []),
  withState('pathes', 'setPathes', []),
  withState('comment', 'setComment', ''),
  lifecycle({
    componentWillMount() {
      console.log(this.props);
      this.props.setNumOfChanges(this.props.changes.length);

      if (this.props.navigation.state.params) {
        console.log(this.props.navigation.state.params);
        this.props.setComment(this.props.navigation.state.params.screenData.text);
        this.props.setName(this.props.navigation.state.params.screenData.name);
        this.props.setSignature(this.props.navigation.state.params.screenData.signature);
      }

      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(DetailPartialView);
