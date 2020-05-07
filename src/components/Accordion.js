import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';

import { apiGetJson } from '../core/api';
import CheckBox from './CheckBox';

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
              props.data.map(item => (
                <CheckBox
                  id={item.id}
                  key={item.id}
                  title={filterTitle(item.columns)}
                  setFilters={props.setFilters}
                  filter={props.filter}
                  date={props.title === 'Due Date'}
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

      let response;
      if (this.props.entity == "items" || this.props.entity == "accounts") {
        response = await apiGetJson(`spectrum/activities/${this.props.entity}/uniques?columns=["${this.props.column}"]`, this.props.token);
      } else {
        response = await apiGetJson(`${this.props.entity}/uniques?search={"fields":[{"operator":"is_in","value":["Assigned","In_progress"],"field":"status"}]}'+
        '&columns=["${this.props.column}"]`, this.props.token);
      }

      const filterItems = [];
      const { orderList } = this.props;
      await response.data.forEach(async (item, index) => {
        if (this.props.title === 'Location') {
          if (item[Object.keys(item)[0]] !== null && item[Object.keys(item)[1]] !== null) {
            if (
              orderList.filter(order => order.city === item[Object.keys(item)[0]]).length > 0
              && orderList.filter(order => order.state === item[Object.keys(item)[1]]).length > 0
            ) {
              await filterItems.push({
                columns: item,
                id: index,
              });
              await this.props.setData(filterItems);
            }
          }
        } else if (this.props.title === 'Due Date') {
          const date = item[Object.keys(item)[0]].split(" ")[0];

          if (date !== null) {
            if (
              orderList.filter(order => (order.date_2).split(" ")[0] === date).length > 0
              && (filterItems.filter(i => (i.columns.date_2).split(" ")[0] == date).length == 0)
            ) {
              await filterItems.push({
                columns: item,
                id: index,
              });
              await this.props.setData(filterItems);
            }
          }
        } else if (this.props.title === 'Project') {
          if (item[Object.keys(item)[0]] !== null) {
            if (
              orderList.filter(
                order => order.items[0].name == item[Object.keys(item)[0]],
              ).length > 0
            ) {
              await filterItems.push({
                columns: item,
                id: index,
              });
              await this.props.setData(filterItems);
            }
          }
        } else if (this.props.title === 'Client') {
          if (item[Object.keys(item)[0]] !== null) {
            if (
              orderList.filter(
                order => order.accounts[0].name === item[Object.keys(item)[0]],
              ).length > 0
            ) {
              await filterItems.push({
                columns: item,
                id: index,
              });
              await this.props.setData(filterItems);
            }
          }
        }
      });
    },
  }),
)(Accordion);
