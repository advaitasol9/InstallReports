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
  Modal,
} from 'react-native';
import moment from 'moment';
import FA from 'react-native-vector-icons/FontAwesome5';

import { apiGetJson } from '../../core/api';
import { Button, Accordion } from '../../components';
import { Text } from '../../components/StyledText';
import { colors, width, height } from '../../styles';

const SearhHeader = ({
  connectionStatus, orderList, setSearchResult, searchResult, setFiltersOpen, filtersOpen, token,
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
          onChangeText={async (text) => {
            if (text === '') {
              const response = await apiGetJson('test-app-1/activities', token);
              setSearchResult(response.data);
            } else if (connectionStatus) {
              const response = await apiGetJson(`test-app-1/activities?search={"name":"${text}"}`, token);
              setSearchResult(response.data);
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
        {
          width,
          height,
          backgroundColor: 'rgba(0,0,0,0.75)',
        },
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
                props.setNotesFilter([]);
                props.setCitiesFilter([]);
                props.setStatesFilter([]);
              }}
            >
              <Text style={{ fontSize: 16, paddingRight: 12, color: colors.grey }}>CLEAR ALL</Text>
            </TouchableOpacity>
            <Button
              bgColor={colors.blue}
              onPress={async () => {
                console.log(props.citiesFilter.join('","'));
                const response = await apiGetJson(
                  `test-app-1/activities?search={${props.citiesFilter.length > 0 ? `"city":"${props.citiesFilter[0]}"` : ''}${props.statesFilter.length > 0 && props.citiesFilter.length > 0 ? ',' : ''}${props.statesFilter.length > 0 ? `"state":"${props.statesFilter[0]}"` : ''}${props.notesFilter.length > 0 && props.statesFilter.length > 0 ? ',' : ''}${props.notesFilter.length > 0 ? `"notes":"${props.notesFilter[0]}"` : ''}}`,
                  props.token,
                );
                console.log(response);
                props.setSearchResult(response.data);
                props.setFiltersOpen(!props.filtersOpen);
                props.setNotesFilter([]);
                props.setCitiesFilter([]);
                props.setStatesFilter([]);
              }}
              caption="Done"
              textColor={colors.white}
            />
          </View>
        </View>
        <ScrollView>
          <Accordion
            title="Cities"
            setFilters={props.setCitiesFilter}
            filter={props.citiesFilter}
            column="city"
          />
          <Accordion
            title="Notes"
            setFilters={props.setNotesFilter}
            filter={props.notesFilter}
            column="notes"
          />
          <Accordion
            title="States"
            setFilters={props.setStatesFilter}
            filter={props.statesFilter}
            column="state"
          />
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default function WorkOrderScreen(props) {
  const renderTile = (item, index) => {
    console.log(item);
    return (
      <TouchableOpacity
        onPress={() => {
          props.setActivityId(item.id);
          props.navigation.navigate('Details');
        }}
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
          <Text style={styles.infoTitle}>{item.name}</Text>
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
  };

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
          token={props.token}
        />


        { console.log(props.searchResult, props.orderList) }
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
