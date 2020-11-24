// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles';
import Header from './Header';

const NoOfflineWOMessage = props => (
  <View style={styles.container}>
    <StatusBar backgroundColor={colors.lightGray} />
    <Header navigation={props.navigation} sideBar />
    <View style={styles.detailStatic}>
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => {
              props.setActivityId(null);
              props.navigation.navigate('Work Order');
            }}
          >
            <Text style={styles.linkButton}>Back to list</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ paddingTop: 8 }}>Cannot display this work order while offline.</Text>
          <Text style={{ paddingTop: 8 }}>
            do not currently have an online connection and this work order has not been previously downloaded.You will need to resume an online connection
            before you can view this work order's details.
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray
  },
  detailStatic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.white
  },
  detailDescription: {
    backgroundColor: 'white',
    padding: 8,
    marginTop: 8,
    marginBottom: 24
  },
  scrollContainer: {
    paddingTop: 8,
    paddingHorizontal: 24
  },
  linkButton: {
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary
  },
  activityHeader: {
    color: colors.primary,
    fontSize: 24,
    paddingTop: 20
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default NoOfflineWOMessage;
