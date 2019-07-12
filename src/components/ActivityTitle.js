// @flow
import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';

import { colors } from '../styles';

const ActivityTitle = props => (
  <View style={styles.container}>
    <Text style={styles.title}>
      {props.title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  container: {
    width: '100%',
    backgroundColor: colors.blue,
  },
});

export default (ActivityTitle);
