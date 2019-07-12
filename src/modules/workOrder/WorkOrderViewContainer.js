import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { setOrderList, setActivityId } from './WorkOrderState';
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
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  lifecycle({
    async componentDidMount() {
      if (this.props.connectionStatus) {
        const data = await apiGetJson('test-app-1/activities/', this.props.token);
        console.log(data);
        this.props.setOrderList(data.data);
      }
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChangesInOffline(this.props.changes.length);
      });
    },
  }),
)(WorkOrderScreen);
