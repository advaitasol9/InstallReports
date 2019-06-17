import React from 'react';
import {
  View, StatusBar, Text, StyleSheet,
} from 'react-native';
import { colors } from '../../../styles';
import { Header, PartialModal } from '../../../components';

import Main from './DetailMain/DetailMainViewContainer';
import Partial from './DetailPartial/DetailPartialViewContainer';
import Fail from './DetailFail/DetailFailViewContainer';


export default function WorkActivityView(props) {
  const saveChanges = () => {
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

  const renderScreen = () => {
    if (props.screen === 'Main') {
      return (
        <Main
          saveChanges={saveChanges}
          setScreen={props.setScreen}
          navigation={props.navigation}
          token={props.token}
          inProgress={props.inProgress}
          setInProgress={props.setInProgress}
          activityData={props.activityData}
          activityId={props.navigation.state.params.activityId}
        />
      );
    }
    if (props.screen === 'Partial') {
      return (
        <Partial
          saveChanges={saveChanges}
          setScreen={props.setScreen}
          navigation={props.navigation}
          setModalVisible={props.setModalVisible}
          activityId={props.navigation.state.params.activityId}
        />
      );
    }
    if (props.screen === 'Failed') {
      return (
        <Fail
          saveChanges={saveChanges}
          setScreen={props.setScreen}
          navigation={props.navigation}
          setModalVisible={props.setModalVisible}
          activityId={props.navigation.state.params.activityId}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
        sideBar
      />
      {renderScreen()}
      <PartialModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray,
  },
});
