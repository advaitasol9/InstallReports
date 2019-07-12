// @flow
import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';

import { colors } from '../styles';

const colorSelect = (status) => {
  if (status === 3) {
    return colors.yellow;
  }
  return 'transparent';
};

const textSelect = (status) => {
  if (status === 3) {
    return 'In Progress';
  }
  return 'In Progress';
};

const ActivityStatus = props => (
  <View
    style={[
      styles.container,
      {
        backgroundColor: colorSelect(props.status),
        display: props.status !== 3 ? 'none' : 'flex',
      },
    ]}
  >
    <Text style={styles.statusText}>
      Work Order - {textSelect(props.status)}
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
