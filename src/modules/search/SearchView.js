import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { OrderListTile, SearchSideFilter } from '../../components';
import { Text } from '../../components/StyledText';
import { apiGetActivities } from '../../core/api';
import { colors } from '../../styles';

export default class WorkOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.page = 1;
    this.searchText = '';
    this.state = {
      isDataLoading: false
    };
  }

  render() {
    const SearhHeader = () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View style={styles.headerInputContainer}>
            <TextInput
              placeholder="Search"
              defaultValue={this.props.searchText}
              onChangeText={text => this.props.setSearchText(text)}
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
              style={{ height: 29, textAlignVertical: 'center' }}
              backgroundColor="#3b5998"
              iconStyle={{ marginLeft: 5 }}
              onPress={() => {
                this.props.search("type")
              }}
            />
          </View>
        </View>
        <View style={styles.headerBottom}>
          {this.props.isLoaded === true ? <Text>{this.props.searchResult.length} Results</Text> : <Text>Searching...</Text>}
          <TouchableOpacity
            onPress={() => {
              this.props.setFiltersOpen(!this.props.filtersOpen);
            }}
          >
            <Text style={{ textAlign: 'right', color: colors.primary }}>SORT & FILTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    const renderTile = (item, index) => <OrderListTile index={index} item={item} setActivityId={this.props.setActivityId} navigation={this.props.navigation} />;

    const loadMoreWorkOrders = async () => {
      if (this.props.searchResult.length < this.props.workOrdersFullCount && !this.state.isDataLoading) {
        this.setState({
          isDataLoading: true
        });

        const statuses = '&search={"fields":[{"operator": "is_in","value": ["assigned","in_progress"],"field": "status"}]}&sort_by=id&sort_order=asc';
        const data = await apiGetActivities('spectrum/activities?with=["items","accounts"]&page=' + (this.page + 1) + '&count=50' + statuses, this.props.token);
        const result = this.props.searchResult;

        if (data.data.data.length > 0) {
          await data.data.data.forEach(activity => {
            result.push(activity);
          });
          this.page += 1;
          this.props.setOrderList(result);
          this.setState({
            isDataLoading: false
          });
        }
      }
    };

    const renderFooter = () => {
      if (!this.state.isDataLoading) return null;

      return (
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <ActivityIndicator animating size="small" />
        </View>
      );
    };

    return (
      <React.Fragment>
        <View style={styles.container}>
          <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
          {SearhHeader()}
          {this.props.searchResult === [] && this.props.connectionStatus ? (
            <View style={styles.containerIndicator}>
              <Text>There is no connection</Text>
            </View>
          ) : (
              <View style={{ flex: 1, width: '100%' }}>
                {this.props.isLoaded === true ? (
                  <FlatList
                    ListHeaderComponent={null}
                    scrollEventThrottle={16}
                    refreshing={false}
                    onRefresh={async () => {
                      this.page = 1;
                      this.props.search();
                    }}
                    data={this.props.searchResult}
                    keyExtractor={(item, index) => {
                      return index.toString();
                    }}
                    renderItem={({ item, index }) => renderTile(item, index)}
                    onEndReached={loadMoreWorkOrders}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                  />
                ) : (
                <Image style={{ height: '100%', width: '100%' }} source={require('../../../assets/images/loading.gif')} />
              )}
            </View>
          )}
        </View>
        <SearchSideFilter {...this.props} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.lightGray
  },
  containerIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  headerTop: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  headerBottom: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  headerInputContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
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
