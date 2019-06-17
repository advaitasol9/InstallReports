import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { apiGetJson } from '../../core/api';

import WorkOrderScreen from './WorkOrderView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected,
      changes: state.workOrder.changesInOffline,
    }),
    dispatch => ({}),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('orderList', 'setOrderList', []),
  lifecycle({
    async componentDidMount() {
      const data = await apiGetJson('test-app-1/activities/', this.props.token);
      this.props.setOrderList(data.data);
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChangesInOffline(this.props.changes.length);
      });
    },
    componentWillUnmount() {
      this._subscribe.remove();
    },
  }),
)(WorkOrderScreen);
