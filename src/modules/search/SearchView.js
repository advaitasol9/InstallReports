import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { apiGetActivities } from '../../core/api';
import { OrderListTile, SearchSideFilter } from '../../components';
import { Text } from '../../components/StyledText';
import { colors } from '../../styles';

export default class WorkOrderScreen extends Component {

  constructor(props) {
    super(props);
    this.page = 2;
    this.searchText = "";
  }

  render() {
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
              <TextInput
                placeholder="Enter activity name"
                defaultValue={this.props.searchText}
                onChangeText={(text) => {
                  this.searchText = text;
                }}
                style={{
                  width: '90%',
                  fontSize: 16,
                  color: colors.grey,
                  padding: 0,
                  alignContent: 'flex-start'
                }}
              />
              <Icon.Button
                name="search"
                borderRadius={0}
                style={{ height: 29, textAlignVertical: "center" }}
                backgroundColor="#3b5998"
                iconStyle={{ marginLeft: 5 }}
                onPress={async () => {
                  this.props.setSearchText(this.searchText);
                  const text = this.searchText;
                  this.props.setIsLoaded(false);
                  if (text === '') {
                    const statuses = '&search={"fields":[{"operator": "is_in","value": ["assigned","in_progress"],"field": "status"}]}';
                    const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]' + statuses, this.props.token);
                    await setSearchResult(data.data.data);
                    this.props.setIsLoaded(true);
                  } else if (connectionStatus) {
                    const searchParams = '&search={"fields":[{"operator":"is_in","value": ["assigned","in_progress"],"field": "status"}],'
                      + '"keyword": "' + text + '",'
                      + '"search_keyword_in": ["items.name","accounts.name","activities.id","activities.address_1","activities.city","activities.state","activities.date_2"]'
                      + '}';
                    const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]' + searchParams, this.props.token);
                    await setSearchResult(data.data.data);
                    this.props.setIsLoaded(true);
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
            {
              this.props.isLoaded === true ?
                <Text>{searchResult.length} Results</Text>
                :
                <Text>Searching...</Text>
            }
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
    const renderTile = (item, index) => (
      <OrderListTile
        index={index}
        item={item}
        setItemId={this.props.setItemId}
        setActivityId={this.props.setActivityId}
        navigation={this.props.navigation}
      />
    );

    return (
      <React.Fragment>
        <View style={styles.container}>
          <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
          <SearhHeader
            connectionStatus={this.props.connectionStatus}
            searchText={this.props.searchText}
            setSearchText={this.props.setSearchText}
            orderList={this.props.orderList}
            setSearchResult={this.props.setSearchResult}
            searchResult={this.props.searchResult}
            setFiltersOpen={this.props.setFiltersOpen}
            filtersOpen={this.props.filtersOpen}
            token={this.props.token}
          />
          {
            this.props.orderList === [] && this.props.connectionStatus
              ? (
                <View style={styles.containerIndicator}>
                  <Text>There is no connection</Text>
                </View>
              )
              : (
                <View style={{ flex: 1, width: '100%' }}>
                  {
                    this.props.isLoaded === true ?
                      <FlatList
                        ListHeaderComponent={null}
                        scrollEventThrottle={16}
                        refreshing={false}
                        data={this.props.searchResult}
                        keyExtractor={(item, index) => {
                          return index.toString();
                        }}
                        renderItem={({ item, index }) => renderTile(item, index)}
                      />
                      :
                      <Image style={{ height: '100%', width: '100%' }} source={require('../../../assets/images/loading.gif')} />
                  }
                </View>
              )
          }
        </View>
        <SearchSideFilter
          {...this.props}
        />
      </React.Fragment>
    );
  }
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
