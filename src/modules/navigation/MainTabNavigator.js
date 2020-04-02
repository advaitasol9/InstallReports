/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Image, View, StyleSheet, Text, Alert,
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import FA from 'react-native-vector-icons/FontAwesome5';

import { colors, fonts } from '../../styles';

import WorkOrderScreen from '../workOrder/WorkOrderViewContainer';
import SearchScreen from '../search/SearchViewContainer';
import ProfileScreen from '../profile/ProfileViewContainer';
import Logout from '../logout/LogoutViewContainer';


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
            <Text style={styles.headerCaption}>Profile</Text>
          </View>
        ),
      },
    },
    Logout: {
      screen: Logout,
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
                  props.navigation.navigate('LogIn', { logOut: true });
                },
              },
            ],
            { cancelable: true },
          );
        },
        header: null,
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Work Order':
            iconName = 'wrench';
            break;
          case 'Search':
            iconName = 'search';
            break;
          case 'Profile':
            iconName = 'user-circle';
            break;
          case 'Logout':
            iconName = 'sign-out-alt';
            break;
          default:
            iconName = 'wrench';
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <FA
              style={{
                fontSize: 20,
              }}
              name={iconName}
              backgroundColor="transparent"
              color={focused ? colors.primary : colors.grey}
            />
          </View>
        );
      },
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: colors.primary,
      showLabel: true,
      style: {
        backgroundColor: colors.white,
        borderTopWidth: 0.5,
        borderTopColor: '#d6d6d6',
      },
    },
  },
);
