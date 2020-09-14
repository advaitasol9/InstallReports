import React from 'react';
import { NavigationActions } from 'react-navigation';
import { TouchableOpacity, Text, View, Alert } from 'react-native';

import { colors } from '../styles';

function SideMenu(props) {
  const navigateToScreen = (route, params) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params
    });
    props.navigation.dispatch(navigateAction);
  };

  return (
    <View style={{ paddingVertical: 32, paddingHorizontal: 24 }}>
      <TouchableOpacity onPress={navigateToScreen('Work Order')}>
        <Text style={styles.text}>Work Order</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('Search')}>
        <Text style={styles.text}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Are you sure?',
            'This will log you out of the app and any unsaved data will be lost.',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: navigateToScreen('LogIn', { logOut: true })
              }
            ],
            { cancelable: true }
          );
        }}
      >
        <Text style={styles.text}>LogOut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  text: {
    fontSize: 20,
    color: colors.black,
    paddingVertical: 8
  }
};

export default SideMenu;
