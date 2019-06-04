import React from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View } from 'react-native';

function SideMenu(props) {
  const navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    props.navigation.dispatch(navigateAction);
  };

  return (
    <View>
      <ScrollView>
        <View>
          <Text>
            Section 1
          </Text>
          <View>
            <Text onPress={navigateToScreen('Work Order')}>
              Work Order
            </Text>
          </View>
        </View>
        <View>
          <Text>
            Section 2
          </Text>
          <View>
            <Text onPress={navigateToScreen('Search')}>
              Search
            </Text>
            <Text onPress={navigateToScreen('Profile')}>
              Profile
            </Text>
          </View>
        </View>
      </ScrollView>
      <View>
        <Text>This is my fixed footer</Text>
      </View>
    </View>
  );
}

export default SideMenu;
