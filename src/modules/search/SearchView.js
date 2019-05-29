import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

import { Text } from '../../components/StyledText';

export default function SearchScreen() {
  // const rnsUrl = 'https://reactnativestarter.com';
  // const handleClick = () => {
  //   Linking.canOpenURL(rnsUrl).then(supported => {
  //     if (supported) {
  //       Linking.openURL(rnsUrl);
  //     } else {
  //       console.log(`Don't know how to open URI: ${rnsUrl}`);
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/background-red.png')}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <View style={styles.section}>
        <Text size={30} bold white style={styles.title}>
          Search Screen
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
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
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
