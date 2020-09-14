import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator } from 'react-navigation';
import FA from 'react-native-vector-icons/FontAwesome5';

import { colors, fonts } from '../../styles';

import { SideMenu } from '../../components';

import DetailsScreen from '../workActivity/workOrderDetails/DetailMain/DetailMainViewContainer';
import DetailsScreenFailure from '../workActivity/workOrderDetails/DetailFail/DetailFailViewContainer';
import DetailsScreenPartial from '../workActivity/workOrderDetails/DetailPartial/DetailPartialViewContainer';
import DetailsScreenPreInstall from '../workActivity/workOrderDetails/DetailPreInstall/DetailPreInstallViewContainer';
import DocsScreen from '../workActivity/workOrderDocs/WorkOrderDocsViewContainer';
import QuestionsScreen from '../workActivity/workOrderQuestions/WorkOrderQuestionsViewContainer';
import CommentScreen from '../workActivity/workOrderComment/WorkOrderCommentViewContainer';
import ManagerScreen from '../workActivity/workOrderManager/WorkOrderManagerViewContainer';

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
    paddingHorizontal: 10
  },
  tabBarIcon: {
    width: 23,
    height: 23
  },
  tabBarIconFocused: {
    tintColor: colors.primary
  },
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70
  },
  headerCaption: {
    fontFamily: fonts.primaryRegular,
    color: colors.white,
    fontSize: 18
  }
});

const DetailsStack = createSwitchNavigator({
  DetailsMain: {
    screen: DetailsScreen,
    navigationOptions: {
      header: null
    }
  },
  DetailsPartial: {
    screen: DetailsScreenPartial,
    navigationOptions: {
      header: null
    }
  },
  DetailsFail: {
    screen: DetailsScreenFailure,
    navigationOptions: {
      header: null
    }
  },
  DetailsPreInstall: {
    screen: DetailsScreenPreInstall,
    navigationOptions: {
      header: null
    }
  }
});

const WorkOrder = createBottomTabNavigator(
  {
    Details: {
      screen: DetailsStack,
      navigationOptions: {
        header: null
      }
    },
    Docs: {
      screen: DocsScreen,
      navigationOptions: {
        header: null
      }
    },
    Questions: {
      screen: QuestionsScreen,
      navigationOptions: {
        header: null
      }
    },
    Message: {
      screen: CommentScreen,
      navigationOptions: {
        header: null
      }
    },
    Manager: {
      screen: ManagerScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Details':
            iconName = 'wrench';
            break;
          case 'Docs':
            iconName = 'file';
            break;
          case 'Questions':
            iconName = 'question-circle';
            break;
          case 'Message':
            iconName = 'comment-dots';
            break;
          case 'Manager':
            iconName = 'black-tie';
            break;
          default:
            iconName = 'wrench';
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <FA
              style={{
                fontSize: 20
              }}
              name={iconName}
              backgroundColor="transparent"
              color={focused ? colors.primary : colors.grey}
            />
          </View>
        );
      }
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: colors.primary,
      showLabel: true,
      style: {
        backgroundColor: colors.white,
        borderTopWidth: 0.5,
        borderTopColor: '#d6d6d6'
      }
    }
  }
);

export default createDrawerNavigator(
  {
    HomeTabs: {
      screen: WorkOrder
    }
  },
  {
    drawerWidth: screenWidth * 0.85,
    backgroundColor: colors.grey,
    drawerPosition: 'right',
    contentComponent: props => <SideMenu {...props} />
  }
);
