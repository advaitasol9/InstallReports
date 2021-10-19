import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { apiGetActivities } from '../../core/api';
import { setActivityId, setOrderList, setSearchResultList } from '../workOrder/WorkOrderState';
import SearchView from './SearchView';

const getFilterChanges = async (props, type) => {
  const searchFields = [{ operator: 'is_in', value: ['assigned', 'in_progress'], field: 'status' }];

  if (props.citiesFilter.length > 0) {
    const cities = [];
    const states = [];
    props.citiesFilter.forEach(async location => {
      cities.push(location.title.split(', ')[0]);
      states.push(location.title.split(', ')[1]);
    });
    let uniqueCities = [...new Set(cities)];
    let uniqueStates = [...new Set(states)];

    if (uniqueCities.length > 0) {
      searchFields.push({ operator: 'is_in', value: uniqueCities, field: 'city' });
    }
    if (uniqueStates.length > 0) {
      searchFields.push({ operator: 'is_in', value: uniqueStates, field: 'state' });
    }
  }

  if (props.itemsFilter.length > 0) {
    await props.setSearchText('');
    const items = props.itemsFilter.map(project => project.title);
    let uniqueProject = [...new Set(items)];
    searchFields.push({ operator: 'is_in', value: uniqueProject, field: 'item.name' });
  }

  var searchParams = { fields: searchFields };

  if (type) {
    if (props.searchText) {
      (searchParams.fields = [{ operator: 'is_in', value: ['assigned', 'in_progress'], field: 'status' }]), (searchParams.keyword = props.searchText);
      searchParams.search_keyword_in = [
        'items.name',
        'accounts.name',
        'activities.id',
        'activities.address_1',
        'activities.city',
        'activities.state',
        'activities.date_2',
        'store'
      ];
    }
  } else {
    if (props.datesFilter.length > 0) {
      props.datesFilter.forEach(async item => {
        searchParams = {
          fields: [{ operator: 'is_in', value: ['assigned', 'in_progress'], field: 'status' }],
          keyword: item.title.split(' ')[0],
          search_keyword_in: ['activities.date_2']
        };
      });
    }
  }
  return searchParams;
};

export default compose(
  connect(
    state => ({
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      orderList: state.workOrder.orderList,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      workOrdersFullCount: state.workOrder.workOrdersFullCount,
      offlineChanges: state.offlineWorkOrder.workOrderChanges,
      searchResultData: state.workOrder.searchResultList,
      filterData: state.workOrder.filterData
    }),
    dispatch => ({
      setOrderList: arr => dispatch(setOrderList(arr)),
      setSearchResultList: arr => dispatch(setSearchResultList(arr)),
      setActivityId: id => dispatch(setActivityId(id))
    })
  ),
  withState('searchResult', 'setSearchResult', []),
  withState('searchText', 'setSearchText', ''),
  withState('filtersOpen', 'setFiltersOpen', false),
  withState('itemsFilter', 'setItemsFilter', []),
  withState('citiesFilter', 'setCitiesFilter', []),
  withState('datesFilter', 'setDatesFilter', []),
  withState('clientsFilter', 'setClientsFilter', []),
  withState('isLoaded', 'setIsLoaded', true),
  withHandlers({
    search: props => async type => {
      props.setIsLoaded(false);
      let count;
      if (props.connectionStatus) {
        searchParams = await getFilterChanges(props, type);
        var res;
        if (searchParams.fields.length > 1 || props.datesFilter.length > 0 || props.searchText) {
          res = await apiGetActivities(
            'spectrum/activities?with=["items","accounts"]&sort_by=id&page=1&count=50&sort_order=asc&search=' + JSON.stringify(searchParams),
            props.token
          );
        }

        if (res != undefined) {
          if (res.data.data.length > 50) {
            Alert.alert(res.data.data.length + ' results found.', 'Only the first 50 results have been displayed. Please refine your search.', [
              { text: 'Ok' }
            ]);
          }
          count = res.appContentFullCount;
          let searchResults = [];
          console.log(res);
          res.data.data.forEach(item => {
            if (res.data.data.filter(i => i.id == item.id).length > 0) {
              searchResults.push(item);
            }
          });
          props.setSearchResult(searchResults);
          props.setSearchResultList(searchResults);
          props.setIsLoaded(true);
          props.setItemsFilter([]);
          props.setCitiesFilter([]);
          props.setDatesFilter([]);
        } else {
          props.setIsLoaded(true);
        }
        return;
      }
      let workOrders = Object.keys(props.offlineWorkOrders).map(key => props.offlineWorkOrders[key]);

      workOrders = workOrders.filter(workOrder => {
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

      if (props.searchText) {
        workOrders = workOrders.filter(workOrder => {
          const text = props.searchText.toLowerCase();
          const item = workOrder.items.find(item => item.name.toLowerCase().includes(text));
          if (item) {
            return true;
          }
          const account = workOrder.accounts.find(item => item.name.toLowerCase().includes(text));
          if (account) {
            return true;
          }
          if (workOrder.id == text) {
            return true;
          }
          if (workOrder.address_1.toLowerCase().includes(text)) {
            return true;
          }
          if (workOrder.city.toLowerCase().includes(text)) {
            return true;
          }
          if (workOrder.state.toLowerCase().includes(text)) {
            return true;
          }
          if (workOrder.date_2.toLowerCase().includes(text)) {
            return true;
          }
          return false;
        });
      }

      if (props.citiesFilter.length) {
        workOrders = workOrders.filter(workOrder => {
          const index = props.citiesFilter.findIndex(item => {
            return workOrder.city == item.title.split(', ')[0] && workOrder.state == item.title.split(', ')[1];
          });
          return index != -1;
        });
      }

      if (props.clientsFilter.length) {
        workOrders = workOrders.filter(workOrder => {
          const index = props.clientsFilter.findIndex(item => workOrder.accounts.findIndex(account => account.name == item.title) != -1);
          return index != -1;
        });
      }

      if (props.itemsFilter.length) {
        workOrders = workOrders.filter(workOrder => {
          const index = props.itemsFilter.findIndex(item => workOrder.items.findIndex(project => project.name == item.title) != -1);
          return index != -1;
        });
      }

      if (props.datesFilter.length) {
        workOrders = workOrders.filter(workOrder => {
          const index = props.datesFilter.findIndex(date => workOrder.date_2.includes(date.title));
          return index != -1;
        });
      }

      props.setSearchResult(workOrders);
      props.setWorkOrdersFullCount(count);
      props.setIsLoaded(true);
    }
  }),
  withHandlers({
    clearFilters: props => async () => {
      props.setItemsFilter([]);
      props.setCitiesFilter([]);
      props.setDatesFilter([]);
      // props.setClientsFilter([]);
      await props.setSearchText('');
      props.setFiltersOpen(false);
      props.setSearchResultList([]);
      props.setSearchResult([]);
    },
    clearCheckItemInFilter: props => async () => {
      await props.setItemsFilter([]);
      await props.setCitiesFilter([]);
      await props.setDatesFilter([]);
    }
  }),
  withHandlers({
    onPressDone: props => async () => {
      await props.setSearchText('');
      await props.setFiltersOpen(false);
      await props.search();
    }
  }),
  lifecycle({
    componentWillMount() {
      // this._unsubscribe = this.props.navigation.addListener('didFocus', async () => {
      //   this.props.search();
      // });
      if (this.props.searchResultData && this.props.searchResultData.length > 0) {
        this.props.setSearchResult(this.props.searchResultData);
        this.props.setSearchResultList(this.props.searchResultData);
        this.props.setIsLoaded(true);
      }
    },

    componentWillUnmount() {
      // this._unsubscribe.remove();
      this.props.setSearchText('');
    }
  })
)(SearchView);
