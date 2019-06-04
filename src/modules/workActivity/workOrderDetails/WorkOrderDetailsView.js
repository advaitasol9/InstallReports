// @flow
import React from 'react';
import {
  StyleSheet, View, Text, StatusBar, TouchableOpacity,
} from 'react-native';
import { colors } from '../../../styles';
import { Button, Header } from '../../../components';

const saveChanges = (props) => {
  if (!props.connectionStatus) {
    const { changes } = props;
    let matches = 0;
    if (changes.length === 0) {
      changes.push({
        activityId: props.navigation.state.params.activityId,
      });
      props.setChanges(changes);
      props.setChangesInOffline(1);
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
        props.setChangesInOffline(changes.length);
      }
    }
  } else {
    console.log('Send changes');
  }
};

export default function WorkActivityView(props) {
  console.log(props);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} barStyle="light-content" />
      <Header
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 32,
        }}
      >
        <View style={{ width: '100%', justifyContent: 'flex-start' }}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Work Order')}>
            <Text
              style={{
                color: colors.primary,
                textDecorationLine: 'underline',
                textDecorationColor: colors.primary,
              }}
            >
              Back to list
            </Text>
          </TouchableOpacity>
        </View>
        <Text>ActivityId {props.navigation.state.params.activityId + 1}</Text>
        <Button onPress={() => saveChanges(props)}>
          <Text style={{ color: 'white' }}>Commit some changes</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.lightGray,
  },
});
