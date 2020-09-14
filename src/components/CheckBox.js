import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';

import { colors } from '../styles';

const checkFilter = props => {
  if (!props.checked) {
    const arr = props.filter;
    arr.push({
      title: props.title,
      id: props.id
    });
    props.setFilters(arr);
  } else {
    const arr = props.filter;
    arr.forEach((item, index) => {
      if (item.id === props.id) {
        arr.splice(index, 1);
      }
    });
    props.setFilters(arr);
  }
  props.setChecked(!props.checked);
};

const CheckBox = props => (
  <TouchableOpacity
    style={[styles.accordionHeader, { height: props.forQuestionList ? 32 : 50 }]}
    onPress={() => {
      if (!props.forQuestionList) {
        checkFilter(props);
      } else {
        props.setAnswer(props.checked);
        props.setChecked(!props.checked);
      }
    }}
  >
    <View style={[styles.accordionChecbox, { backgroundColor: props.checked ? colors.blue : colors.white }]}>
      <FA name="check" color={colors.white} style={{ fontSize: 10 }} />
    </View>
    <Text style={{ marginLeft: 8 }}>{props.date ? moment(props.title).format('MM/DD/YY') : props.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  accordionHeader: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  accordionChecbox: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default compose(
  withState('checked', 'setChecked', false),
  lifecycle({
    componentDidMount() {
      const arr = this.props.filter;
      arr.forEach(item => {
        if (this.props.forQuestionList) {
          if (item === this.props.title) {
            this.props.setChecked(true);
          }
        } else if (item.id === this.props.id) {
          this.props.setChecked(true);
        }
      });
    }
  })
)(CheckBox);
