import {
  compose, setStatic, withState, lifecycle,
} from 'recompose';
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
  setStatic('navigationOptions', () => ({
    header: null,
  })),
  withState('changesInOffline', 'setChangesInOffline', 0),
  lifecycle({
    componentDidMount() {
      this.props.setChangesInOffline(this.props.changes.length);
    },
  }),
)(WorkActivityView);
