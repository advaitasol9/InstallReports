import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { apiGetJson } from '../../core/api';
import { setOrderList } from '../workOrder/WorkOrderState';


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
    }),
  ),
  withState('searchResult', 'setSearchResult', []),
  withState('searchText', 'setSearchText', ''),
  withState('filtersOpen', 'setFiltersOpen', false),
  withState('clientFilter', 'setClientFilter', []),
  withState('dateFilter', 'setDateFilter', []),
  withState('projectFilter', 'setProjectFilter', []),
  withState('locationFilter', 'setLocationFilter', []),
  lifecycle({
    async componentDidMount() {
      if (this.props.connectionStatus) {
        const data = await apiGetJson('test-app-1/activities/', this.props.token);
        this.props.setSearchResult(data.data);
      } else {
        this.props.setSearchResult(this.props.orderList);
      }
    },
  }),
)(SearchView);
