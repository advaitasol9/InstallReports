import React from 'react';
import { View, StatusBar } from 'react-native';

import Navigator from './navigation/Navigator';
import { colors } from '../styles';

export default function AppView() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
      <Navigator onNavigationStateChange={() => {}} uriPrefix="/app" />
    </View>
  );
}
