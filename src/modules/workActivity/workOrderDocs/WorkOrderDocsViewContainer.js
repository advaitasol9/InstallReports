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
      // itemId: state.workOrder.itemId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id))
    })
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('docs', 'setDocs', []),
  withState('isLoading', 'setIsloading', true),
  withState('imageURL', 'setImageURL', ''),
  withState('imageModal', 'setImageModal', false),
  lifecycle({
    componentDidMount() {
      if (this.props.connectionStatus) {
        apiGetJson(`activities/${this.props.activityId}?with=["items"]`, this.props.token).then(async response => {
          await this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });

        apiGetJson(`activities/${this.props.activityId}/files`, this.props.token).then(response => {
          this.props.setDocs(response.data);
        });
      } else {
        this.props.setActivityData(this.props.orderList.filter(order => order.id === this.props.activityId)[0]);
        this.props.setIsloading(false);
      }
    }
  })
)(WorkOrderDocsView);
