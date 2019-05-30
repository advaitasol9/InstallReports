// @flow
import React from 'react';
import {
  StyleSheet, View, Text, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { colors } from '../../styles';
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
  const renderHeader = (changesNum, connectionStatus) => {
    console.log(props);
    return (
      <View style={styles.header}>
        <View style={{ width: '20%', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={require('../../../assets/images/icons/arrow-back-blue.png')}
              resizeMode="contain"
              style={{ height: 20 }}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={styles.logo}
              source={require('../../../assets/images/logo.png')}
            />
          </View>
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={[
                styles.connectionIndicator,
                {
                  backgroundColor: connectionStatus ? 'green' : 'red',
                  marginRight: connectionStatus ? 0 : 8,
                },
              ]}
            />
            {!connectionStatus && (
              <Text style={{ color: connectionStatus ? 'green' : 'red' }}>{changesNum}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };
  console.log(props);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} barStyle="light-content" />
      {renderHeader(props.changes.length, props.connectionStatus)}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Text>ActivityId {props.navigation.state.params.activityId + 1}</Text>
        <Button onPress={() => saveChanges(props)}>
          <Text>Commit some changes</Text>
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
  header: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 16,
    elevation: 5,
  },
  logo: {
    height: 60,
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
  connectionIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 16,
  },
});
