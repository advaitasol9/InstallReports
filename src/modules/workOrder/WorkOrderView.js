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

export default function WorkOrderScreen(props) {
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

  const renderHeader = (changesNum, connectionStatus) => {
    return (
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.logo}
            source={require('../../../assets/images/logo.png')}
          />
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ paddingBottom: 12 }}>My Work Orders</Text>
            <View
              style={[
                styles.connectionIndicator,
                {
                  backgroundColor: connectionStatus ? 'green' : 'red',
                  marginRight: connectionStatus ? 0 : 8,
                },
              ]}
            />
            {!connectionStatus && (
              <Text style={{ color: connectionStatus ? 'green' : 'red' }}>{changesNum.length}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log(changesNum);
              props.navigation.navigate({ routeName: 'Search' });
            }}
          >
            <Text style={{ textAlign: 'right', color: colors.primary }}>
              SORT & FILTER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  const renderTile = (item, index) => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('Activity', { activityId: index })}
      style={[styles.tileContainer, { marginTop: index === 0 ? 8 : 0 }]}
    >
      <View style={styles.tileLogoContainer}>
        <Image
          style={styles.tileLogo}
          source={require('../../../assets/images/tileLogoExample.png')}
        />
      </View>
      <View style={styles.tileInfoContainer}>
        <Text style={styles.infoCompany}>Starbucks</Text>
        <Text style={styles.infoTitle}>HiVee Inline & Encap</Text>
        <View style={styles.infoBottomSection}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoBottomText, { marginRight: 20 }]}>#12123</Text>
              <Text style={styles.infoBottomText}>Elbur, Il</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.infoBottomText}>Due 7/5/19</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      {renderHeader(props.changesInOffline, props.connectionStatus)}
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
    paddingHorizontal: 16,
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
    flexDirection: 'row',
    paddingRight: 16,
  },
  connectionIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 16,
  },
  tileLogoContainer: {
    width: '15%',
    alignItems: 'center',
  },
  tileLogo: {
    width: 50,
    height: 50,
    aspectRatio: 1,
  },
  tileInfoContainer: {
    width: '85%',
    paddingLeft: 8,
  },
  infoCompany: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingTop: 8,
  },
  infoBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 32,
  },
  infoBottomText: {
    color: '#636363',
    fontSize: 12,
  },
});
