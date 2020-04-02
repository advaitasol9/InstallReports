// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Loading } from '../../components';
import { colors, width, height } from '../../styles';

const FixedHeader = ({ navigation }) => (
  <View style={styles.headerCourse}>
    <TouchableOpacity
      onPress={() => {
        console.log(navigation);
        navigation.navigate('Docs');
      }}
    >
      <View style={styles.row}>
        <Text>Back</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const PdfContainer = props => (
  <View style={styles.container}>
    <StatusBar hidden />
    <FixedHeader navigation={props.navigation} />
    <Pdf
      style={{ width, height: height - 64 }}
      onError={error => console.log(error)}
      onLoadComplete={() => props.setIsLoaded(true)}
      source={{ uri: props.navigation.state.params.uri }}
    />
    {!props.isLoaded && (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 100,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loading />
      </View>
    )}
  </View>
);

export default PdfContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGray,
  },
  headerCourse: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16,
  },
});
