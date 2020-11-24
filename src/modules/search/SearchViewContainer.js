import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { apiGetActivities } from '../../core/api';
import { setActivityId, setOrderList } from '../workOrder/WorkOrderState';
import SearchView from './SearchView';

export default compose(
  connect(
    state => ({
      connectionStatus: state.app.isConnected,
      token: state.profile.security_token.token,
      orderList: state.workOrder.orderList,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      offlineChanges: state.offlineWorkOrder.workOrderChanges
    }),
    dispatch => ({
      setOrderList: arr => dispatch(setOrderList(arr)),
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
  withState('isLoaded', 'setIsLoaded', false),
  withHandlers({
    search: props => async () => {
      props.setIsLoaded(false);
      if (props.connectionStatus) {
        const searchFields = [{ operator: 'is_in', value: ['assigned', 'in_progress'], field: 'status' }];

        if (props.citiesFilter.length > 0) {
          const cities = [];
          const states = [];
          props.citiesFilter.forEach(async item => {
            cities.push(item.title.split(', ')[0]);
            states.push(item.title.split(', ')[1]);
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

        //Project filter
        if (props.itemsFilter.length > 0) {
          const items = props.itemsFilter.map(item => item.title);
          let uniqueItems = [...new Set(items)];
          searchFields.push({ operator: 'is_in', value: uniqueItems, field: 'item.name' });
        }

        //Client filter
        if (props.clientsFilter.length > 0) {
          const accounts = props.clientsFilter.map(item => item.title);
          let uniqueAccounts = [...new Set(accounts)];
          searchFields.push({ operator: 'is_in', value: uniqueAccounts, field: 'account.name' });
        }

        const searchParams = { fields: searchFields };

        if (props.searchText) {
          searchParams.keyword = props.searchText;
          searchParams.search_keyword_in = [
            'items.name',
            'accounts.name',
            'activities.id',
            'activities.address_1',
            'activities.city',
            'activities.state',
            'activities.date_2'
          ];
        }

        let searchRequests = [];

        searchRequests.push(
          apiGetActivities('spectrum/activities?with=["items","accounts"]&sort_by=id&sort_order=asc&search=' + JSON.stringify(searchParams), props.token)
        );

        //Dates filter
        if (props.datesFilter.length > 0) {
          props.datesFilter.forEach(async item => {
            const searchParams = {
              fields: [{ operator: 'is_in', value: ['assigned', 'in_progress'], field: 'status' }],
              keyword: item.title.split(' ')[0],
              search_keyword_in: ['activities.date_2']
            };
            searchRequests.push(
              apiGetActivities('spectrum/activities?with=["items","accounts"]&sort_by=id&sort_order=asc&search=' + JSON.stringify(searchParams), props.token)
            );
          });
        }

        const res = await Promise.all(searchRequests);
        if (props.datesFilter.length > 0) {
          let searchResults = [];
          res[0].data.data.forEach(item => {
            if (res[1].data.data.filter(i => i.id == item.id).length > 0) {
              searchResults.push(item);
            }
          });
          result = searchResults;
        } else {
          result = res[0].data.data;
        }

        props.setSearchResult(result);
        props.setIsLoaded(true);
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
      props.setIsLoaded(true);
    }
  }),
  withHandlers({
    clearFilters: props => async () => {
      props.setItemsFilter([]);
      props.setCitiesFilter([]);
      props.setDatesFilter([]);
      props.setClientsFilter([]);
      await props.setSearchText('');
      props.setFiltersOpen(false);
      await props.search();
    }
  }),
  withHandlers({
    onPressDone: props => async () => {
      await props.setFiltersOpen(false);
      await props.search();
    }
  }),
  lifecycle({
    componentWillMount() {
      this._unsubscribe = this.props.navigation.addListener('didFocus', async () => {
        this.props.search();
      });
    },
    componentWillUnmount() {
      this._unsubscribe.remove();
    }
  })
)(SearchView);
