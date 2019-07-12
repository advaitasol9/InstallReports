import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { apiGetJson } from '../../../core/api';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import WorkOrderQuestionsView from './WorkOrderQuestionsView';
import { addQuestionPhoto } from './WorkOrderQuestionsState';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      photos: state.workOrderQuestion.photos,
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addQuestionPhoto(arr)),
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  lifecycle({
    componentDidMount() {
      this.props.setChangesInOffline(this.props.changes.length);
      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(WorkOrderQuestionsView);
