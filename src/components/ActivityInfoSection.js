// @flow
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import Geocode from 'react-geocode';
import RNLocation from 'react-native-location';
import { colors } from '../styles';

const ActivityInfoSection = props => (
  <View style={styles.detailStatic}>
    <View style={{ width: '100%', justifyContent: 'flex-start' }}>
      <TouchableOpacity style={{ width: 100 }} onPress={() => props.navigation.navigate('Work Order')}>
        <Text style={styles.linkButton}>Back to list</Text>
      </TouchableOpacity>
      <Text style={styles.activityHeader}>Work Order #{props.activityData.id}</Text>
      <Text style={{ color: colors.primary, fontSize: 20, paddingTop: 8 }}>
        Project: {props.activityData.items?.length > 0 ? props.activityData.items[0].name : null}
      </Text>
      <Text style={{ paddingTop: 8 }}>
        {props.activityData.location && `${props.activityData.location}`}
        {props.activityData.store_name && ` - ${props.activityData.store_name}`}
        {props.activityData.store_id && ` #${props.activityData.store_id}`}
      </Text>
      <Text style={{ paddingTop: 8 }}>
        {props.activityData.address_1 && `${props.activityData.address_1}, `}
        {props.activityData.address_2 && `${props.activityData.address_2}, `}
        {props.activityData.city && `${props.activityData.city}, `}
        {props.activityData.state && `${props.activityData.state} `}
        {props.activityData.zip && `${props.activityData.zip}`}
      </Text>
      <TouchableOpacity
        style={{ width: 100, paddingTop: 8 }}
        onPress={() => {
          //console.log(props.activityData);
          Geocode.setApiKey('AIzaSyBoupsj11qhEKGUVQeJpp9tx4dB-GG2YjI');
          const destination = `${props.activityData.address_1},${props.activityData.city}, ${props.activityData.state} ${props.activityData.zip}`.replace(
            /[ ,.]/g,
            '+'
          );
          RNLocation.configure({
            distanceFilter: 5.0
          });

          RNLocation.requestPermission({
            ios: 'whenInUse',
            android: {
              detail: 'coarse'
            }
          }).then(granted => {
            if (granted) {
              const unsubscribe = RNLocation.subscribeToLocationUpdates(async locations => {
                unsubscribe();
                const currentLongitude = await JSON.stringify(locations[0].longitude);
                const currentLatitude = await JSON.stringify(locations[0].latitude);

                const geocodeRes = await Geocode.fromLatLng(currentLatitude, currentLongitude);
                console.log(geocodeRes);
                const address = geocodeRes.results[0].formatted_address.replace(/[ ,.]/g, '+');
                const url = `https://www.google.com/maps/dir/${address}/${destination}`;

                try {
                  await Linking.openURL(url);
                } catch (error) {
                  console.log(error);
                }
              });
            }
          });
        }}
      >
        <Text style={styles.linkButton}>Directions</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  detailStatic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.white
  },
  linkButton: {
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary
  },
  activityHeader: {
    color: colors.primary,
    fontSize: 24,
    paddingTop: 20
  }
});

export default ActivityInfoSection;
