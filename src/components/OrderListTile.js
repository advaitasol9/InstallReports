// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import moment from 'moment';

import { colors } from '../styles';

export default props => (
  <TouchableOpacity
    onPress={() => {
      props.setActivityId(props.item.id);
      props.setItemId(props.item.items[0].id);
      props.navigation.navigate('Details');
    }}
    style={[styles.tileContainer, { marginTop: props.index === 0 ? 8 : 0 }]}
  >
    <View style={styles.tileLogoContainer}>
      <Image
        style={styles.tileLogo}
        source={require('../../assets/images/tileLogoExample.png')}
      />
    </View>
    <View style={styles.tileInfoContainer}>
      <Text style={styles.infoCompany}>{props.item.items[0].name}</Text>
      <Text style={styles.infoTitle}>{props.item.name}</Text>
      <View style={styles.infoBottomSection}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.infoBottomText, { marginRight: 20 }]}>
              #{props.item.id}
            </Text>
            <Text style={styles.infoBottomText}>
              {props.item.address_1 && (
                `${props.item.address_1}, `
              )}
              {props.item.city && (
                `${props.item.city}, `
              )}
              {props.item.state && (
                `${props.item.state}`
              )}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.infoBottomText}>
            {props.item.date_2 && (
              `Due ${moment(props.item.date_2).format('DD/MM/YY')}`
            )}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
