import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { apiGetJson } from '../../core/api';
import { setOrderList, setActivityId } from '../workOrder/WorkOrderState';


import SearchView from './SearchView';

export default compose(
  connect(
    state => ({
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      orderList: state.workOrder.orderList,
    }),
    dispatch => ({
      setOrderList: arr => dispatch(setOrderList(arr)),
      setActivityId: id => dispatch(setActivityId(id)),
    }),
  ),
  withState('searchResult', 'setSearchResult', []),
  withState('searchText', 'setSearchText', ''),
  withState('filtersOpen', 'setFiltersOpen', false),
  withState('notesFilter', 'setNotesFilter', []),
  withState('citiesFilter', 'setCitiesFilter', []),
  withState('statesFilter', 'setStatesFilter', []),
  lifecycle({
    async componentWillMount() {
      if (this.props.connectionStatus) {
        const data = await apiGetJson('test-app-1/activities?with=[%22items%22]', this.props.token);
        const result = [];
        await data.data.forEach((activity) => {
          if (activity.items.length > 0) {
            activity.items.forEach(async (item) => {
              console.log(item);
              result.push({
                ...item,
                address_1: activity.address_1,
                city: activity.city,
                state: activity.state,
              });
            });
          }
        });
        this.props.setSearchResult(result);
      } else {
        await this.props.setSearchResult(this.props.orderList);
      }
    },
  }),
)(SearchView);
