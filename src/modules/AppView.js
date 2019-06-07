import React from 'react';
import { View } from 'react-native';

import Navigator from './navigation/Navigator';


export default function AppView() {
  return (
    <View style={{ flex: 1 }}>
      <Navigator onNavigationStateChange={() => {}} uriPrefix="/app" />
    </View>
  );
}
