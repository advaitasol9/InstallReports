import React from 'react';
import {
  StyleSheet, View, Text, StatusBar,
} from 'react-native';
import { colors } from '../../../styles';
import { Header } from '../../../components';

export default function WorkOrderQuestionsView(props) {
  console.log(props);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
        sideBar
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <Text>Work Order Questions Screen</Text>
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
