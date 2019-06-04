import React from 'react';

import {
  TouchableOpacity, View, Text, Image, Dimensions,
} from 'react-native';

import { colors } from '../styles';


const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;


const SideBar = () => {
  return (
    <View
      style={{
        position: 'absolute',
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 10,
      }}
    />
  );
};


export default function Header({
  connectionStatus, changesNum, navigation, sortAndFilter,
}) {
  console.log(navigation);
  return (
    <React.Fragment>
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
          />
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ paddingBottom: 12 }}>My Work Orders</Text>
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
          {sortAndFilter && (
            <TouchableOpacity
              onPress={() => {
                console.log(changesNum);
                navigation.navigate({ routeName: 'Search' });
              }}
            >
              <Text style={{ textAlign: 'right', color: colors.primary }}>
                SORT & FILTER
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = {
  connectionIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 16,
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
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    height: 60,
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
};
