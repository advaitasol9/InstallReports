import React from 'react';

import {
  TouchableOpacity, View, Text, Image, Dimensions,
} from 'react-native';
import {
  DrawerActions,
} from 'react-navigation';

import { colors } from '../styles';


const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

export default function Header({
  connectionStatus, changesNum, navigation, sortAndFilter, sideBar, indicator,title
}) {
  return (
    <View style={styles.header}>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo.png')}
        />
      </View>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text>{title}</Text>
          {indicator && (
            <View
              style={[
                styles.connectionIndicator,
                {
                  backgroundColor: connectionStatus ? 'green' : 'red',
                  marginRight: connectionStatus ? 0 : 8,
                },
              ]}
            />
          )}
          {indicator && !connectionStatus && (
            <Text style={{ color: connectionStatus ? 'green' : 'red' }}>{changesNum}</Text>
          )}
          {sideBar && (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginLeft: 12, alignItems: 'center' }}
            >
              <Image
                style={styles.burger}
                source={require('../../assets/images/burger1.png')}
              />
            </TouchableOpacity>
          )}
        </View>
        {sortAndFilter && (
          <TouchableOpacity
            onPress={() => {
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
    height: 40,
    aspectRatio: 4,
    resizeMode: 'contain',
  },
  burger: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
};
