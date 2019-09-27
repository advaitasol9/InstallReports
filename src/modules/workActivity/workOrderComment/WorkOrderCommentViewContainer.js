import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import WorkOrderCommentView from './WorkOrderCommentView';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../core/api';
import { addCommentPhoto } from './WorkOrderCommentState';

export default compose(
  connect(
    state => ({
      accountId: state.profile.user.id,
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      photos: state.workOrderComment.photos,
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addCommentPhoto(arr)),
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('activityData', 'setActivityData', {}),
  withState('comment', 'setComment', ''),
  withState('data', 'setData', []),
  withState('isLoading', 'setIsloading', true),
  lifecycle({
    componentWillMount() {
      this.props.setChangesInOffline(this.props.changes.length);
      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });

      apiGetJson(`test-app-1/activities/${this.props.activityId}/comments`, this.props.token)
        .then((response) => {
          console.log(response.data);
          this.props.setData(response.data);
        });
    },
  }),
)(WorkOrderCommentView);
