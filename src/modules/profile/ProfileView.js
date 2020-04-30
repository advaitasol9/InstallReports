import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '../../styles';
import { Text } from '../../components/StyledText';

export default function ProfileScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text size={30} bold white style={styles.title}>
          Profile Screen
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.lightGray,
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
  },
});
