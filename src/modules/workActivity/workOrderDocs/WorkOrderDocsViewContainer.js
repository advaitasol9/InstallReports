// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import WorkOrderDocsView from './WorkOrderDocsView';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../core/api';


export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
    }),
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('docs', 'setDocs', []),
  withState('isLoading', 'setIsloading', true),
  lifecycle({
    componentDidMount() {
      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then(async (response) => {
          await this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });
      apiGetJson(`test-app-1/items/${this.props.activityId}/files`, this.props.token)
        .then((response) => {
          console.log(this.props.docs);
          console.log(response);
          this.props.setDocs(response.data);
        });
    },
  }),
)(WorkOrderDocsView);
