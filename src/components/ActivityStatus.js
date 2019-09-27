// @flow
import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import { colors } from '../styles';

const colorSelect = (status) => {
  if (status === 2) {
    return colors.yellow;
  }
  return 'transparent';
};

const ActivityStatus = props => (
  <View
    style={[
      styles.container,
      {
        backgroundColor: colors.yellow,
        display: 'flex',
      },
    ]}
  >
    {console.log(props.status)}
    <Text style={styles.statusText}>
      Work Order - {props.status}
    </Text>
  </View>
);

export default (ActivityStatus);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.yellow,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 12,
  },
});
