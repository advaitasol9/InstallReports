// @flow
import React from 'react';
import {
  StyleSheet, View, Text, StatusBar,
} from 'react-native';

export default function WorkActivityView(props) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <Text>ActivityId {props.navigation.state.params.activityId + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
