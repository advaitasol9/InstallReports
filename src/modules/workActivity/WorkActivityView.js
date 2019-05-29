// @flow
import React from 'react';
import {
  StyleSheet, View, Text, StatusBar,
} from 'react-native';
import { Button } from '../../components';

const saveChanges = (props) => {
  if (!props.connectionStatus) {
    const { changes } = props;
    let matches = 0;
    if (changes.length === 0) {
      changes.push({
        activityId: props.navigation.state.params.activityId,
      });
      props.setChanges(changes);
    } else {
      for (let i = 0; i < changes.length; i += 1) {
        if (changes[i].activityId === props.navigation.state.params.activityId) {
          matches += 1;
          break;
        }
      }
      if (matches === 0) {
        changes.push({
          activityId: props.navigation.state.params.activityId,
        });
        props.setChanges(changes);
      }
    }
  } else {
    console.log('Send changes');
  }
};

export default function WorkActivityView(props) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <Text>ActivityId {props.navigation.state.params.activityId + 1}</Text>
      <Button onPress={() => saveChanges(props)}>
        <Text>Commit some changes</Text>
      </Button>
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
