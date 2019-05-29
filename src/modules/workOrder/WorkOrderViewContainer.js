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
    dispatch => ({
      logOut: () => dispatch(logOut()),
    }),
  ),
  withState('changesInOffline', 'setChanges', 0),
  lifecycle({
    componentDidMount() {
      console.log(this.props);
      this.props.setChanges(this.props.changes.length);
      apiGetJson('test-app-1/activities/', this.props.token)
        .then((response) => {
          console.log(response);
        });
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChanges(this.props.changes);
      });
    },
    componentWillUnmount() {
      console.log('chuchuchu');
    },
  }),
)(WorkOrderScreen);
