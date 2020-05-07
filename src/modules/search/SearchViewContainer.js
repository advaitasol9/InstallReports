import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { setOrderList, setActivityId, setItemId } from '../workOrder/WorkOrderState';
import { apiGetActivities } from '../../core/api';

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
      // setItemId: id => dispatch(setItemId(id)),
    }),
  ),
  withState('searchResult', 'setSearchResult', []),
  withState('searchText', 'setSearchText', ''),
  withState('filtersOpen', 'setFiltersOpen', false),
  withState('datesFilter', 'setDatesFilter', []),
  withState('citiesFilter', 'setCitiesFilter', []),
  withState('itemsFilter', 'setItemsFilter', []),
  withState('clientsFilter', 'setClientsFilter', []),
  withState('isLoaded', 'setIsLoaded', false),
  lifecycle({
    async componentWillMount() {
      const statuses = '&search={"fields":[{"operator": "is_in","value": ["assigned","in_progress"],"field": "status"}]}';
      const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]' + statuses, this.props.token);
      result = data.data.data;
      this.props.setSearchResult(data.data.data);
      this.props.setIsLoaded(true);
    },
  }),
)(SearchView);
