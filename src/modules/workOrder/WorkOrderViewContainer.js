import { connect } from 'react-redux';
import { compose, lifecycle, shallowEqual, withHandlers, withState } from 'recompose';
import { apiGetActivities } from '../../core/api';
import { setActivityId, setOrderList, setWorkOrdersFullCount } from './WorkOrderState';
import WorkOrderScreen from './WorkOrderView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      connectionStatus: state.app.isConnected,
      changes: state.workOrder.changesInOffline,
      orderList: state.workOrder.orderList,
      workOrdersFullCount: state.workOrder.workOrdersFullCount,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      offlineChanges: state.offlineWorkOrder.workOrderChanges
    }),
    dispatch => ({
      setOrderList: arr => dispatch(setOrderList(arr)),
      setActivityId: id => dispatch(setActivityId(id)),
      setWorkOrdersFullCount: id => dispatch(setWorkOrdersFullCount(id))
    })
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('isLoaded', 'setLoaded', false),
  withHandlers({
    refreshList: props => async () => {
      props.setOrderList([]);
      props.setLoaded(false);
      let list;
      let count;

      if (props.connectionStatus) {
        const statuses = '&search={"fields":[{"operator": "is_in","value": ["assigned","in_progress"],"field": "status"}]}&sort_by=id&sort_order=asc';
        const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]&page=1&count=10' + statuses, props.token);
        list = data.data.data;
        count = data.appContentFullCount;
      } else {
        list = Object.keys(props.offlineWorkOrders).map(key => props.offlineWorkOrders[key]);
        count = list.length;
      }

      const workOrders = list.filter(workOrder => {
        if (workOrder.status == 'Complete' || workOrder.status == 'Failed') {
          return false;
        }

        const changes = props.offlineChanges[workOrder.id];

        if (!changes || !changes.length) {
          return true;
        }

        const change = changes.find(item => item.type == 'status' && (item.payload == 'Complete' || item.payload == 'Failed'));

        if (change) {
          return false;
        }

        return true;
      });

      props.setOrderList(workOrders);
      props.setWorkOrdersFullCount(count);
      props.setLoaded(true);
    }
  }),
  lifecycle({
    async componentWillMount() {
      this.props.refreshList();
    },
    async componentDidMount() {
      this._subscribe = this.props.navigation.addListener('didFocus', () => {
        this.props.setChangesInOffline(this.props.changes.length);
      });
    },
    async componentWillUnmount() {
      this._subscribe.remove();
    }
  })
)(WorkOrderScreen);
