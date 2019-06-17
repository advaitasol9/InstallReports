import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import { Text } from '../../components/StyledText';
import { colors } from '../../styles';

const data = [
  {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
];

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

  const renderTile = (item, index) => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('Details', { activityId: item.id })}
      style={[styles.tileContainer, { marginTop: index === 0 ? 8 : 0 }]}
    >
      <View style={styles.tileLogoContainer}>
        <Image
          style={styles.tileLogo}
          source={require('../../../assets/images/tileLogoExample.png')}
        />
      </View>
      <View style={styles.tileInfoContainer}>
        <Text style={styles.infoCompany}>{item.name}</Text>
        <Text style={styles.infoTitle}>{item.notes}</Text>
        <View style={styles.infoBottomSection}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoBottomText, { marginRight: 20 }]}>#{item.id}</Text>
              <Text style={styles.infoBottomText}>
                {`${item.address_1}, ${item.city}, ${item.state}`}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.infoBottomText}>Due {moment(item.date_1).format('DD/MM/YY')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  console.log(props.orderList);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} barStyle="dark-content" />
      {
        props.orderList === []
          ? (
            <View style={styles.containerIndicator}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )
          : (
            <FlatList
              ListHeaderComponent={null}
              scrollEventThrottle={16}
              data={props.orderList}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => renderTile(item, index)}
            />
          )
      }
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
  containerIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  tileContainer: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    flexDirection: 'row',
    paddingRight: 16,
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
