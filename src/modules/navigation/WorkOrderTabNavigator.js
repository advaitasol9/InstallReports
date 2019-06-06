/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Image, View, StyleSheet, Dimensions,
} from 'react-native';
import { createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';

import { colors, fonts } from '../../styles';

import { SideMenu } from '../../components';

import DetailsScreen from '../workActivity/workOrderDetails/WorkOrderDetailsViewContainer';
import DocsScreen from '../workActivity/workOrderDocs/WorkOrderDocsViewContainer';
import QuestionsScreen from '../workActivity/workOrderQuestions/WorkOrderQuestionsViewContainer';
import CommentScreen from '../workActivity/workOrderComment/WorkOrderCommentViewContainer';
import ManagerScreen from '../workActivity/workOrderManager/WorkOrderManagerViewContainer';


const iconDetails = require('../../../assets/images/tabbar/home.png');
const iconDocs = require('../../../assets/images/tabbar/home.png');
const iconQuestions = require('../../../assets/images/tabbar/home.png');
const iconComment = require('../../../assets/images/tabbar/home.png');
const iconManager = require('../../../assets/images/tabbar/home.png');

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

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

const WorkOrder = createBottomTabNavigator(
  {
    Details: {
      screen: DetailsScreen,
      navigationOptions: {
        header: null,
      },
    },
    Docs: {
      screen: DocsScreen,
      navigationOptions: {
        header: null,
      },
    },
    Questions: {
      screen: QuestionsScreen,
      navigationOptions: {
        header: null,
      },
    },
    Comment: {
      screen: CommentScreen,
      navigationOptions: {
        header: null,
      },
    },
    Manager: {
      screen: ManagerScreen,
      navigationOptions: {
        header: null,
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
          case 'Details':
            iconSource = iconDetails;
            break;
          case 'Docs':
            iconSource = iconDocs;
            break;
          case 'Questions':
            iconSource = iconQuestions;
            break;
          case 'Comment':
            iconSource = iconComment;
            break;
          case 'Manager':
            iconSource = iconManager;
            break;
          default:
            iconSource = iconManager;
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
    swipeEnabled: true,
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

export default createDrawerNavigator({
  HomeTabs: {
    screen: WorkOrder,
  },
}, {
  drawerWidth: screenWidth * 0.85,
  backgroundColor: colors.grey,
  drawerPosition: 'right',
  contentComponent: props => <SideMenu {...props} />,
});
