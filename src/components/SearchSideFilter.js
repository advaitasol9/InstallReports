// @flow
import React from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accordion, Button } from '../components';
import { apiGetActivities } from '../core/api';
import { colors, height, width } from '../styles';

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
            <TouchableOpacity onPress={() => props.clearFilters()}>
              <Text style={{ fontSize: 16, paddingRight: 12, color: colors.grey }}>CLEAR ALL</Text>
            </TouchableOpacity>
            <Button style={{ width: 80 }} bgColor={colors.blue} onPress={async () => props.onPressDone()} caption="Done" textColor={colors.white} />
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
