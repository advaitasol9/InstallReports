import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { setOrderList, setActivityId, setItemId, setWorkOrdersFullCount } from './WorkOrderState';
import { apiGetActivities } from '../../core/api';

import {
  Image,
} from 'react-native';
import WorkOrderScreen from './WorkOrderView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected,
      changes: state.workOrder.changesInOffline,
      orderList: state.workOrder.orderList,
      workOrdersFullCount: state.workOrder.workOrdersFullCount,
    }),
    dispatch => ({
      setOrderList: arr => dispatch(setOrderList(arr)),
      setActivityId: id => dispatch(setActivityId(id)),
      setWorkOrdersFullCount: id => dispatch(setWorkOrdersFullCount(id)),
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('isLoaded', 'setLoaded', false),
  lifecycle({
    async componentWillMount() {
      this.props.setOrderList([]);
      if (this.props.connectionStatus) {
        const statuses = '&search={"fields":[{"operator": "is_in","value": ["assigned","in_progress"],"field": "status"}]}';
        const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]&page=1&count=10' + statuses, this.props.token);
        this.props.setOrderList(data.data.data);
        this.props.setWorkOrdersFullCount(data.appContentFullCount);
        this.props.setLoaded(true);
      }
    },
    async componentDidMount() {
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChangesInOffline(this.props.changes.length);
      });
    },
  }),
)(WorkOrderScreen);
