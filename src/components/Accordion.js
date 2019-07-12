import React from 'react';
import { compose, withState } from 'recompose';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';

import FilterItem from './FilterItem';

const PartialModal = (props) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.accrodionHeader}
        onPress={() => {
          props.setIsOpen(!props.isOpen);
        }}
      >
        <Text style={{ fontSize: 20 }}>{props.title}</Text>
        <FA style={{ fontSize: 20 }} name={props.isOpen ? 'chevron-up' : 'chevron-down'} />
      </TouchableOpacity>
      {
        props.isOpen && (
          <View style={{ width: '100%' }}>
            {
              props.data.map(item => (
                <FilterItem
                  id={item.id}
                  title={item.title}
                  numOfOrders={item.numOfOrders}
                  setFilters={props.setFilters}
                  filter={props.filter}
                />
              ))
            }
          </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  accrodionHeader: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default compose(
  withState('isOpen', 'setIsOpen', false),
)(PartialModal);
