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
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      photos: state.workOrderComment.photos
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addCommentPhoto(arr)),
      setChanges: arr => dispatch(setChanges(arr))
    })
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('comment', 'setComment', ''),
  withState('data', 'setData', []),
  withState('isLoading', 'setIsloading', true),
  lifecycle({
    componentWillMount() {
      this.props.setNumOfChanges(this.props.changes.length);
      console.log('refresh whole comments');
      clearInterval(this._interval);

      if (this.props.navigation.state.params && this.props.navigation.state.params.screenData.text) {
        this.props.setComment(this.props.navigation.state.params.screenData.text);
      }

      if (this.props.connectionStatus) {
        apiGetJson(`activities/${this.props.activityId}?with=["items"]`, this.props.token).then(response => {
          this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });

        apiGetJson(`activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"installer","field":"channel"}]}`, this.props.token).then(response => {
          response.data.map(msg => {
            const regex = /(<([^>]+)>)/gi;
            const result = msg.text.replace(regex, '');
            const result1 = result.replace('&nbsp;', ' ');
            msg.text = result1;
          });
          this.props.setData(response.data.reverse());
        });
      } else {
        this.props.setActivityData(this.props.orderList.filter(order => order.id === this.props.activityId)[0]);
        this.props.setIsloading(false);
      }
    },
    componentDidMount() {
      this._interval = setInterval(() => {
        if (this.props.activityId == null) {
          clearInterval(this._interval);
        } else {
          apiGetJson(
            `activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"installer","field":"channel"}]}`,
            this.props.token
          ).then(response => {
            response.data.map(msg => {
              const regex = /(<([^>]+)>)/gi;
              const result = msg.text.replace(regex, '');
              const result1 = result.replace('&nbsp;', ' ');
              msg.text = result1;
            });
            this.props.setData(response.data.reverse());
          });
        }
      }, 10000);
    }
  })
)(WorkOrderCommentView);
