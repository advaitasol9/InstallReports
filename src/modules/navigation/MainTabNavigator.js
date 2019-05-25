/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Image, View, StyleSheet, Text, Alert,
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import { colors, fonts } from '../../styles';

import WorkOrderScreen from '../workOrder/WorkOrderViewContainer';
import SearchScreen from '../search/SearchViewContainer';
import ProfileScreen from '../profile/ProfileViewContainer';

const iconHome = require('../../../assets/images/tabbar/home.png');
const iconGrids = require('../../../assets/images/tabbar/grids.png');
const iconPages = require('../../../assets/images/tabbar/pages.png');
const iconComponents = require('../../../assets/images/tabbar/components.png');

const hederBackground = require('../../../assets/images/topBarBg-red.png');

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
    paddingHorizontal: 10,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
  },
  tabBarIconFocused: {
    tintColor: colors.primary,
  },
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  headerCaption: {
    fontFamily: fonts.primaryRegular,
    color: colors.white,
    fontSize: 18,
  },
});

export default createBottomTabNavigator(
  {
    'Work Order': {
      screen: WorkOrderScreen,
      navigationOptions: {
        header: null,
        headerBackground: (
          <Image
            style={{ flex: 1 }}
            source={hederBackground}
            resizeMode="cover"
          />
        ),
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        header: (
          <View style={styles.headerContainer}>
            <Image style={styles.headerImage} source={hederBackground} />
            <Text style={styles.headerCaption}>Grids</Text>
          </View>
        ),
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: (
          <View style={styles.headerContainer}>
            <Image style={styles.headerImage} source={hederBackground} />
            <Text style={styles.headerCaption}>Work Order</Text>
          </View>
        ),
      },
    },
    Logout: {
      screen: WorkOrderScreen,
      navigationOptions: {
        tabBarOnPress: (props) => {
          Alert.alert(
            'Are you sure?',
            'This will log you out of the app and any unsaved data will be lost.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  props.navigation.navigate('Auth', {
                    logOut: true,
                  });
                },
              },
            ],
            { cancelable: true },
          );
        },
        header: (
          <View style={styles.headerContainer}>
            <Image style={styles.headerImage} source={hederBackground} />
            <Text style={styles.headerCaption}>Logout</Text>
          </View>
        ),
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconSource;
        switch (routeName) {
          case 'Work Order':
            iconSource = iconHome;
            break;
          case 'Search':
            iconSource = iconGrids;
            break;
          case 'Profile':
            iconSource = iconPages;
            break;
          case 'Logout':
            iconSource = iconComponents;
            break;
          default:
            iconSource = iconComponents;
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <Image
              resizeMode="contain"
              source={iconSource}
              style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
            />
          </View>
        );
      },
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: true,
      style: {
        backgroundColor: colors.white,
        borderTopWidth: 0.5,
        borderTopColor: '#d6d6d6',
      },
      labelStyle: {
        color: colors.grey,
      },
    },
  },
);
