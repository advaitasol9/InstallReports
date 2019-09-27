import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';

import { apiGetJson } from '../core/api';
import FilterItem from './FilterItem';

const Accordion = (props) => {
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
              props.data.map((item, index) => {
                if (item[props.column] === null) {
                  return null;
                }
                return (
                  <FilterItem
                    id={index}
                    title={item[props.column]}
                    numOfOrders={1}
                    setFilters={props.setFilters}
                    filter={props.filter}
                  />
                );
              })
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
  connect(
    state => ({
      token: state.profile.security_token.token,
    }),
    dispatch => ({}),
  ),
  withState('isOpen', 'setIsOpen', false),
  withState('data', 'setData', []),
  lifecycle({
    async componentWillMount() {
      console.log(this.props);
      const response = await apiGetJson(`test-app-1/activities/uniques?entity=activities&columns=["${this.props.column}"]`, this.props.token);
      this.props.setData(response.data);
      console.log(response.data);
    },
  }),
)(Accordion);
