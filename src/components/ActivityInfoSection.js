// @flow
import React from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet,
} from 'react-native';

import { colors } from '../styles';

const ActivityInfoSection = props => (
  <View style={styles.detailStatic}>
    <View style={{ width: '100%', justifyContent: 'flex-start' }}>
      <TouchableOpacity style={{ width: 100 }} onPress={() => props.navigation.navigate('Work Order')}>
        <Text style={styles.linkButton}>
          Back to list
        </Text>
      </TouchableOpacity>
      <Text style={styles.activityHeader}>
        Work Order #{props.activityData.id}
      </Text>
      <Text style={{ color: colors.primary, fontSize: 20, paddingTop: 8 }}>
        Project: {props.activityData.notes}
      </Text>
      <Text style={{ paddingTop: 8 }}>
        {props.activityData.name} - {props.activityData.city} #685
      </Text>
      <Text style={{ paddingTop: 8 }}>
        {`${props.activityData.address_1}, ${props.activityData.city}, ${props.activityData.state} ${props.activityData.zip}`}
      </Text>
      <TouchableOpacity style={{ width: 100, paddingTop: 8 }} onPress={() => props.navigation.navigate('Work Order')}>
        <Text style={styles.linkButton}>
          Directions
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  detailStatic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.white,
  },
  linkButton: {
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  activityHeader: {
    color: colors.primary,
    fontSize: 24,
    paddingTop: 20,
  },
});

export default (ActivityInfoSection);
