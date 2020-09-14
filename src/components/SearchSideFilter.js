// @flow
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { colors, width, height } from '../styles';
import { Button, Accordion } from '../components';
import { apiGetActivities } from '../core/api';

export default props => (
  <Modal animationType="fade" transparent visible={props.filtersOpen}>
    <View style={[styles.sideFilterContainer, { width, height, backgroundColor: 'rgba(0,0,0,0.75)' }]}>
      <View
        style={{
          width: width * 0.85,
          height,
          backgroundColor: colors.white,
          paddingBottom: Platform.OS === 'android' ? 20 : 0
        }}
      >
        <View style={styles.sideFilterHeader}>
          <Text style={{ fontSize: 16 }}>{props.searchResult.length} Results</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={async () => {
                props.setIsLoaded(false);
                props.setCitiesFilter([]);
                props.setSearchText('');
                props.setFiltersOpen(!props.filtersOpen);
                const statuses = '&search={"fields":[{"operator": "is_in","value": ["assigned","in_progress"],"field": "status"}]}&sort_by=id&sort_order=asc';
                const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]' + statuses, props.token);
                result = data.data.data;
                props.setSearchResult(data.data.data);
                props.setIsLoaded(true);
              }}
            >
              <Text style={{ fontSize: 16, paddingRight: 12, color: colors.grey }}>CLEAR ALL</Text>
            </TouchableOpacity>
            <Button
              style={{ width: 80 }}
              bgColor={colors.blue}
              onPress={async () => {
                let cities = [];
                let states = [];
                let items = [];
                let accounts = [];
                let searchRequests = [];

                searchQueries = [];
                props.setSearchText('');

                let searchParams = '&search={"fields":[' + '{"operator":"is_in","value": ["assigned","in_progress"],"field": "status"}';

                if (props.citiesFilter.length > 0) {
                  props.citiesFilter.forEach(async item => {
                    cities.push(item.title.split(', ')[0]);
                    states.push(item.title.split(', ')[1]);
                  });
                  let uniqueCities = [...new Set(cities)];
                  let uniqueStates = [...new Set(states)];

                  if (uniqueCities.length > 0) {
                    searchParams += ',{"operator":"is_in","value": ' + JSON.stringify(uniqueCities) + ',"field": "city"}';
                  }
                  if (uniqueStates.length > 0) {
                    searchParams += ',{"operator":"is_in","value": ' + JSON.stringify(uniqueStates) + ',"field": "state"}';
                  }
                }

                //Project filter
                if (props.itemsFilter.length > 0) {
                  props.itemsFilter.forEach(async item => {
                    items.push(item.title);
                  });
                  let uniqueItems = [...new Set(items)];
                  searchParams += ',{"operator":"is_in","value": ' + JSON.stringify(uniqueItems) + ',"field": "item.name"}';
                }

                //Client filter
                if (props.clientsFilter.length > 0) {
                  props.clientsFilter.forEach(async item => {
                    accounts.push(item.title);
                  });
                  let uniqueAccounts = [...new Set(accounts)];
                  searchParams += ',{"operator":"is_in","value": ' + JSON.stringify(uniqueAccounts) + ',"field": "account.name"}';
                }

                searchParams += ']}';
                searchRequests.push(apiGetActivities('spectrum/activities?with=["items","accounts"]&sort_by=id&sort_order=asc' + searchParams, props.token));

                //Dates filter
                if (props.datesFilter.length > 0) {
                  props.datesFilter.forEach(async item => {
                    const searchParams =
                      '&search={"fields":[{"operator":"is_in","value": ["assigned","in_progress"],"field": "status"}],' +
                      '"keyword": "' +
                      item.title.split(' ')[0] +
                      '",' +
                      '"search_keyword_in": ["activities.date_2"]' +
                      '}';
                    searchRequests.push(
                      apiGetActivities('spectrum/activities?with=["items","accounts"]&sort_by=id&sort_order=asc' + searchParams, props.token)
                    );
                  });
                }
                props.setFiltersOpen(false);
                props.setIsLoaded(false);
                await Promise.all(searchRequests)
                  .then(res => {
                    if (props.datesFilter.length > 0) {
                      let searchResults = [];
                      res[0].data.data.forEach(item => {
                        if (res[1].data.data.filter(i => i.id == item.id).length > 0) {
                          searchResults.push(item);
                        }
                      });
                      props.setSearchResult(searchResults);
                      props.setIsLoaded(true);
                    } else {
                      props.setSearchResult(res[0].data.data);
                      props.setIsLoaded(true);
                    }
                  })
                  .catch(err => {});
              }}
              caption="Done"
              textColor={colors.white}
            />
          </View>
        </View>
        <ScrollView>
          <Accordion
            title="Location"
            setFilters={props.setCitiesFilter}
            filter={props.citiesFilter}
            column="city&#34;, &#34;state"
            orderList={props.orderList}
            entity="activities"
          />
          <Accordion
            title="Due Date"
            setFilters={props.setDatesFilter}
            filter={props.datesFilter}
            column="date_2"
            orderList={props.orderList}
            entity="activities"
          />
          <Accordion title="Project" setFilters={props.setItemsFilter} filter={props.itemsFilter} column="name" entity="items" orderList={props.orderList} />
          <Accordion
            title="Client"
            setFilters={props.setClientsFilter}
            filter={props.clientsFilter}
            column="name"
            orderList={props.orderList}
            entity="accounts"
          />
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  sideFilterContainer: {
    alignItems: 'flex-end'
  },
  sideFilterHeader: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 50 : 70,
    paddingTop: Platform.OS === 'android' ? 0 : 20,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    justifyContent: 'space-between'
  }
});
