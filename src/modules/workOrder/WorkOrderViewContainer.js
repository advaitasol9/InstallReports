import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { setOrderList, setActivityId, setItemId } from './WorkOrderState';
import { apiGetJson } from '../../core/api';

import WorkOrderScreen from './WorkOrderView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected,
      changes: state.workOrder.changesInOffline,
      orderList: state.workOrder.orderList,
    }),
    dispatch => ({
      setOrderList: arr => dispatch(setOrderList(arr)),
      setActivityId: id => dispatch(setActivityId(id)),
      setItemId: id => dispatch(setItemId(id)),
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  lifecycle({
    async componentWillMount() {
      if (this.props.connectionStatus) {
        const data = await apiGetJson('test-app-1/spectrum/activities?with=["items","accounts"]', this.props.token);
        console.log(data);
        const result = [];
        await data.data.forEach((activity) => {
          if (activity.items.length > 0
            && activity.status !== 'Partial'
            && activity.status !== 'Failed'
            && activity.status !== 'Complete'
          ) {
            result.push(activity);
          }
        });
        console.log(data);
        this.props.setOrderList(result);
      }
    },
    async componentDidMount() {
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChangesInOffline(this.props.changes.length);
      });
    },
  }),
)(WorkOrderScreen);
