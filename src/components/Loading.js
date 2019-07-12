import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { colors } from '../styles';

export default function Loading() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />
    </View>
  );
}
