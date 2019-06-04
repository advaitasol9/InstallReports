// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import WorkOrderManagerView from './WorkOrderManagerView';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      connectionStatus: state.app.isConnected,
    }),
    dispatch => ({}),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  lifecycle({
    componentDidMount() {
      this.props.setChangesInOffline(this.props.changes.length);
    },
  }),
)(WorkOrderManagerView);
