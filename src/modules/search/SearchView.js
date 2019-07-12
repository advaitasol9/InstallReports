import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import FA from 'react-native-vector-icons/FontAwesome5';

import { apiGetJson } from '../../core/api';
import { Button, Accordion } from '../../components';
import { Text } from '../../components/StyledText';
import { colors, width, height } from '../../styles';

const filterList = [
  {
    id: 1,
    title: 'someTitle 1',
    numOfOrders: '1',
  },
  {
    id: 2,
    title: 'someTitle 2',
    numOfOrders: '2',
  },
  {
    id: 3,
    title: 'someTitle 3',
    numOfOrders: '3',
  },
  {
    id: 4,
    title: 'someTitle 4',
    numOfOrders: '4',
  },
  {
    id: 5,
    title: 'someTitle 5',
    numOfOrders: '5',
  },
  {
    id: 6,
    title: 'someTitle 6',
    numOfOrders: '6',
  },
  {
    id: 7,
    title: 'someTitle 7',
    numOfOrders: '7',
  },
  {
    id: 8,
    title: 'someTitle 8',
    numOfOrders: '8',
  },
  {
    id: 9,
    title: 'someTitle 9',
    numOfOrders: '9',
  },
];

const SearhHeader = ({
  connectionStatus, orderList, setSearchResult, searchResult, setFiltersOpen, filtersOpen,
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
          placeholder="Placeholder..."
          style={{
            width: '90%',
            fontSize: 16,
            color: colors.grey,
            padding: 0,
          }}
          onChangeText={(text) => {
            if (connectionStatus) {
              console.log(text);
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
  <View
    style={[
      styles.sideFilterContainer,
      {
        width: props.filtersOpen ? width : 0,
        height: props.filtersOpen ? height : 0,
      },
    ]}
  >
    <View
      style={[
        styles.sideFilterBackground,
        {
          width: props.filtersOpen ? width : 0,
          height: props.filtersOpen ? height : 0,
        },
      ]}
    />
    <View
      style={{
        width: width * 0.85,
        height: height - 50,
        backgroundColor: colors.white,
        paddingBottom: Platform.OS === 'android' ? 20 : 0,
      }}
    >
      <View style={styles.sideFilterHeader}>
        <Text style={{ fontSize: 16 }}>{props.searchResult.length} Results</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              props.setClientFilter([]);
              props.setDateFilter([]);
              props.setProjectFilter([]);
              props.setLocationFilter([]);
              console.log(
                props.clientFilter, '   ',
                props.dateFilter, '   ',
                props.projectFilter, '   ',
                props.locationFilter,
              );
            }}
          >
            <Text style={{ fontSize: 16, paddingRight: 12, color: colors.grey }}>CLEAR ALL</Text>
          </TouchableOpacity>
          <Button
            bgColor={colors.blue}
            onPress={() => {
              props.setFiltersOpen(!props.filtersOpen);
              console.log(props.setFiltersOpen, '   ', props.filtersOpen);
            }}
          >
            <Text style={{ fontSize: 16, color: colors.white }}>Done</Text>
          </Button>
        </View>
      </View>
      <ScrollView>
        <Accordion
          title="Client"
          data={filterList}
          setFilters={props.setClientFilter}
          filter={props.clientFilter}
        />
        <Accordion
          title="Project"
          data={filterList}
          setFilters={props.setProjectFilter}
          filter={props.projectFilter}
        />
        <Accordion
          title="Due Date"
          data={filterList}
          setFilters={props.setDateFilter}
          filter={props.dateFilter}
        />
        <Accordion
          title="Location"
          data={filterList}
          setFilters={props.setLocationFilter}
          filter={props.locationFilter}
        />
      </ScrollView>
    </View>
  </View>
);

export default function WorkOrderScreen(props) {
  const renderTile = (item, index) => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('Details', { activityId: item.id })}
      style={[styles.tileContainer, { marginTop: index === 0 ? 8 : 0 }]}
    >
      <View style={styles.tileLogoContainer}>
        <Image
          style={styles.tileLogo}
          source={require('../../../assets/images/tileLogoExample.png')}
        />
      </View>
      <View style={styles.tileInfoContainer}>
        <Text style={styles.infoCompany}>{item.name}</Text>
        <Text style={styles.infoTitle}>{item.notes}</Text>
        <View style={styles.infoBottomSection}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoBottomText, { marginRight: 20 }]}>#{item.id}</Text>
              <Text style={styles.infoBottomText}>
                {`${item.address_1}, ${item.city}, ${item.state}`}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.infoBottomText}>Due {moment(item.date_1).format('DD/MM/YY')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <React.Fragment>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
        <SearhHeader
          connectionStatus={props.connectionStatus}
          orderList={props.orderList}
          setSearchResult={props.setSearchResult}
          searchResult={props.searchResult}
          setFiltersOpen={props.setFiltersOpen}
          filtersOpen={props.filtersOpen}
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
                  const data = await apiGetJson('test-app-1/activities/', props.token);
                  props.setOrderList(data.data);
                }}
                data={props.searchResult}
                keyExtractor={item => item.id}
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
  tileContainer: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    flexDirection: 'row',
    paddingRight: 16,
  },
  tileLogoContainer: {
    width: '15%',
    alignItems: 'center',
  },
  tileLogo: {
    width: 50,
    height: 50,
    aspectRatio: 1,
  },
  tileInfoContainer: {
    width: '85%',
    paddingLeft: 8,
  },
  infoCompany: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingTop: 8,
  },
  infoBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 32,
  },
  infoBottomText: {
    color: '#636363',
    fontSize: 12,
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
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'flex-end',
  },
  sideFilterBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3,
    backgroundColor: colors.black,
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
