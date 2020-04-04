import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';

import { apiGetJson } from '../../core/api';
import { Button, Accordion, OrderListTile } from '../../components';
import { Text } from '../../components/StyledText';
import { colors, width, height } from '../../styles';

const SearhHeader = ({
  connectionStatus,
  orderList,
  setSearchResult,
  searchResult,
  setFiltersOpen,
  filtersOpen,
  token,
  searchText,
  setSearchText,
}) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.headerInputContainer}>
          <FA
            style={{ fontSize: 16, marginRight: 12 }}
            name="search"
            backgroundColor="transparent"
            color={colors.grey}
          />
          <TextInput
            placeholder="Enter activity name"
            value={searchText}
            style={{
              width: '90%',
              fontSize: 16,
              color: colors.grey,
              padding: 0,
            }}
            onChangeText={async (text) => {
              setSearchText(text);
              if (text === '') {
                const response = await apiGetJson('test-app-1/activities?with=[%22items%22,%22accounts%22]', token);
                const result = [];
                await response.data.forEach((activity) => {
                  if (activity.items.length > 0
                    && activity.status !== 'Partial'
                    && activity.status !== 'Failed'
                    && activity.status !== 'Complete'
                  ) {
                    result.push(activity);
                  }
                });
                setSearchResult(result);
              } else if (connectionStatus) {
                const response = await apiGetJson(`test-app-1/activities?with=[%22items%22,%22accounts%22]&&search={"name":"${text}"}`, token);
                const result = [];
                await response.data.forEach((activity) => {
                  if (activity.items.length > 0
                    && activity.status !== 'Partial'
                    && activity.status !== 'Failed'
                    && activity.status !== 'Complete'
                  ) {
                    result.push(activity);
                  }
                });
                console.log(result);
                setSearchResult(result);
              } else if (orderList !== [] && !connectionStatus) {
                const newResult = [];
                orderList.forEach((item) => {
                  const n = item.notes.search(text);
                  if (n !== -1) {
                    newResult.push(item);
                  }
                });
                setSearchResult(newResult);
              }
            }}
          />
        </View>
      </View>
      <View style={styles.headerBottom}>
        <Text>{searchResult.length} Results</Text>
        <TouchableOpacity
          onPress={() => {
            setFiltersOpen(!filtersOpen);
          }}
        >
          <Text style={{ textAlign: 'right', color: colors.primary }}>
            SORT & FILTER
        </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

const SearchSideFilter = props => (
  <Modal
    animationType="fade"
    transparent
    visible={props.filtersOpen}
  >
    <View
      style={[
        styles.sideFilterContainer,
        { width, height, backgroundColor: 'rgba(0,0,0,0.75)' },
      ]}
    >
      <View
        style={{
          width: width * 0.85,
          height,
          backgroundColor: colors.white,
          paddingBottom: Platform.OS === 'android' ? 20 : 0,
        }}
      >
        <View style={styles.sideFilterHeader}>
          <Text style={{ fontSize: 16 }}>{props.searchResult.length} Results</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                props.setCitiesFilter([]);
                props.setFiltersOpen(!props.filtersOpen);
              }}
            >
              <Text style={{ fontSize: 16, paddingRight: 12, color: colors.grey }}>CLEAR ALL</Text>
            </TouchableOpacity>
            <Button
              bgColor={colors.blue}
              onPress={async () => {
                const activities = new Set();
                const locationActivities = new Set();
                const dateActivities = new Set();
                if (props.citiesFilter.length > 0) {
                  props.citiesFilter.forEach(async (item) => {
                    const byCity = await apiGetJson(
                      `test-app-1/activities?search={"city":"${item.title.split(', ', 1)[0]}"}`,
                      props.token,
                    );
                    const byState = await apiGetJson(
                      `test-app-1/activities?search={"state":"${item.title.slice(item.title.indexOf(',') + 2, item.title.length)}"}`,
                      props.token,
                    );
                    if (byCity.data.length > 0 && byState.data.length) {
                      byCity.data.forEach((orderCity) => {
                        if (orderCity.status === 'In_Progress' || orderCity.status === 'Open') {
                          byState.data.forEach((orderState) => {
                            if (orderCity.id === orderState.id) {
                              locationActivities.add(orderCity.id);
                            }
                          });
                        }
                      });
                    }
                  });
                }
                if (props.datesFilter.length > 0) {
                  props.datesFilter.forEach(async (item) => {
                    const byDates = await props.orderList.filter(activity => activity.date_2 === item.title);
                    byDates.forEach((dateOrder) => {
                      dateActivities.add(dateOrder.id);
                    });
                  });
                }
                const filtersActivities = [];
                const searchResult = [];
                if (props.datesFilter.length > 0) {
                  await filtersActivities.push(dateActivities);
                }
                if (props.citiesFilter.length > 0) {
                  await filtersActivities.push(locationActivities);
                }
                const data = await apiGetJson('test-app-1/activities?with=[%22items%22,%22accounts%22]', props.token);
                if (filtersActivities > 0) {
                  filtersActivities[0].forEach((id) => {
                    const counter = filtersActivities.reduce((accumulator, currentValue, index) => {
                      if (filtersActivities[index].has(id)) {
                        return accumulator + 1;
                      }
                      return accumulator;
                    }, 0);
                    if (counter === filtersActivities.length) {
                      activities.add(id);
                    }
                  });
                }
                if (activities > 0) {
                  activities.forEach((activityId) => {
                    data.data.forEach((item) => {
                      if (activityId === item.id) {
                        searchResult.push(item);
                        props.setSearchResult(searchResult);
                      }
                    });
                  });
                }
                // props.setSearchResult(response.data);
                props.setFiltersOpen(!props.filtersOpen);
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
          <Accordion
            title="Project"
            setFilters={props.setItemsFilter}
            filter={props.itemsFilter}
            column="name"
            entity="items"
            orderList={props.orderList}
          />
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

export default function WorkOrderScreen(props) {
  const renderTile = (item, index) => (
    <OrderListTile
      index={index}
      item={item}
      setItemId={props.setItemId}
      setActivityId={props.setActivityId}
      navigation={props.navigation}
    />
  );

  return (
    <React.Fragment>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
        <SearhHeader
          connectionStatus={props.connectionStatus}
          searchText={props.searchText}
          setSearchText={props.setSearchText}
          orderList={props.orderList}
          setSearchResult={props.setSearchResult}
          searchResult={props.searchResult}
          setFiltersOpen={props.setFiltersOpen}
          filtersOpen={props.filtersOpen}
          token={props.token}
        />
        {
          props.orderList === [] && props.connectionStatus
            ? (
              <View style={styles.containerIndicator}>
                <Text>There is no connection</Text>
              </View>
            )
            : (
              <FlatList
                ListHeaderComponent={null}
                scrollEventThrottle={16}
                refreshing={false}
                onRefresh={async () => {
                  if (props.connectionStatus) {
                    const data = await apiGetJson(
                      'test-app-1/activities?with=[%22items%22,%22accounts%22]', props.token,
                    );
                    const result = [];
                    await data.data.forEach((activity) => {
                      if (activity.items.length > 0
                        && activity.status !== 'Partial'
                        && activity.status !== 'Failed'
                        && activity.status !== 'Complete'
                      ) {
                        result.push(activity);
                      }
                    });
                    props.setSearchText('');
                    props.setSearchResult(result);
                    props.setOrderList(result);
                  }
                }}
                data={props.searchResult}
                keyExtractor={item => item.activityId}
                renderItem={({ item, index }) => renderTile(item, index)}
              />
            )
        }
      </View>
      <SearchSideFilter
        {...props}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.lightGray,
  },
  containerIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  headerContainer: {
    width: '100%',
    height: Platform.OS === 'android' ? 100 : 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : 20,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTop: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerBottom: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerInputContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sideFilterContainer: {
    alignItems: 'flex-end',
  },
  sideFilterHeader: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 50 : 70,
    paddingTop: Platform.OS === 'android' ? 0 : 20,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    justifyContent: 'space-between',
  },
});
