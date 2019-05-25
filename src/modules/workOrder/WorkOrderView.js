import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { Text } from '../../components/StyledText';
import { colors } from '../../styles';

export default function HomeScreen(props) {
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

  const data = [
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
  ];

  const renderHeader = () => (
    <View
      style={styles.header}
    >
      <View
        style={{ width: '30%', alignItems: 'center' }}
      >
        <Image
          style={styles.logo}
          source={require('../../../assets/images/logo.png')}
        />
      </View>
      <View
        style={{ width: '40%', alignItems: 'center' }}
      >
        <Text
          style={{ paddingBottom: 12 }}
        >
          My Work Orders
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate({ routeName: 'Search' });
          }}
        >
          <Text
            style={{ color: colors.primary }}
          >
            SORT & FILTER
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const renderTile = (item, index) => (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Activity', { activityId: index });
      }}
      style={[styles.tileContainer, { marginTop: index === 0 ? 8 : 0 }]}
    >
      <View style={{ flexDirection: 'row', width: '100%', paddingRight: 16 }}>
        <View style={{ width: '15%', alignItems: 'center' }}>
          <Image
            style={{ width: 50, height: 50, aspectRatio: 1 }}
            source={require('../../../assets/images/tileLogoExample.png')}
          />
        </View>
        <View style={{ width: '85%', paddingLeft: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>
            Starbucks
          </Text>
          <Text style={{ ontSize: 14, fontWeight: 'normal', paddingTop: 8 }}>
            HiVee Inline & Encap
          </Text>
          <View
            style={{
              flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 32,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#636363', fontSize: 12, marginRight: 24 }}>
                  #12123
                </Text>
                <Text style={{ color: '#636363', fontSize: 12 }}>
                  Elbur, Il
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingTop: 10, color: '#636363', fontSize: 10, justifyContent: 'center',
                }}
              >
                Due 7/5/19
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      {renderHeader()}
      <FlatList
        ListHeaderComponent={null}
        scrollEventThrottle={16}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => renderTile(item, index)}
      />
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
  header: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 10,
  },
  logo: {
    height: 60,
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
  tileContainer: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: 'white',
    marginBottom: 8,
  },
});
