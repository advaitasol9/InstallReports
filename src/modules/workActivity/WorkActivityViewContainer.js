// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { setChanges } from '../workOrder/WorkOrderState';


import WorkActivityView from './WorkActivityView';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      connectionStatus: state.app.isConnected,
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
)(WorkActivityView);
