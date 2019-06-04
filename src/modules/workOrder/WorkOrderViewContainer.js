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
  lifecycle({
    componentDidMount() {
      apiGetJson('test-app-1/activities/', this.props.token)
        .then((response) => {
          console.log(response);
        });
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChangesInOffline(this.props.changes.length);
      });
    },
  }),
)(WorkOrderScreen);
