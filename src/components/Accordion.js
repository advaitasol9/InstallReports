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
  const filterTitle = (item) => {
    let title = '';
    for (const key in item) {
      if ({}.hasOwnProperty.call(item, key)) {
        title = `${title}, ${item[key]}`;
      }
    }
    return title.slice(2);
  };

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
              props.data.map((item, index) => (
                <FilterItem
                  id={item.id}
                  title={filterTitle(item.columns)}
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
      const response = await apiGetJson(`test-app-1/activities/uniques?entity=${this.props.entity}&columns=["${this.props.column}"]`, this.props.token);
      const filterItems = [];
      await response.data.forEach(async (item, index) => {
        if (item[Object.keys(item)[0]] !== null) {
          await apiGetJson(
            `test-app-1/activities?search={"${Object.keys(item)[0]}":"${item[Object.keys(item)[0]]}"}`,
            this.props.token,
          ).then(async (res) => {
            if (res.data.filter(order => order.status === 'Open' || order.status === 'In_Progress').length > 0) {
              await filterItems.push({
                columns: item,
                id: index,
              });
              await this.props.setData(filterItems);
            }
          });
        }
      });
      console.log(this.props.data);
    },
  }),
)(Accordion);
