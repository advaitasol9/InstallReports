// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Geocode from 'react-geocode';
import RNLocation from 'react-native-location';

import { colors } from '../../../../styles';
import {
  Button,
  PartialModal,
  Header,
  ActivityTitle,
  ActivityStatus,
} from '../../../../components';

export default function DetailMainView(props) {
  if (props.isLoading === true) {
    return (
      <View style={styles.backgroundActivity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
        sideBar
        indicator
      />
      <ScrollView style={{ width: '100%' }}>
        <View
          style={styles.detailStatic}
        >
          <View style={{ width: '100%', justifyContent: 'flex-start' }}>
            <TouchableOpacity
              style={{ width: 100 }}
              onPress={() => {
                props.setActivityId(null);
                props.navigation.navigate('Work Order');
              }}
            >
              <Text style={styles.linkButton}>
                Back to list
              </Text>
            </TouchableOpacity>
            <Text style={styles.activityHeader}>
              Work Order #{props.activityData.id}
            </Text>
            <Text style={{ color: colors.primary, fontSize: 20, paddingTop: 8 }}>
              Project: {props.activityData.name}
            </Text>
            <Text style={{ paddingTop: 8 }}>
              {props.activityData.notes && (
                `${props.activityData.notes}`
              )}
              {props.activityData.city && (
                ` - ${props.activityData.city}`
              )}
            </Text>
            <Text style={{ paddingTop: 8 }}>
              {props.activityData.address_2 && (
                `${props.activityData.address_2}, `
              )}
              {props.activityData.city && (
                `${props.activityData.city}, `
              )}
              {props.activityData.state && (
                `${props.activityData.state}, `
              )}
              {props.activityData.zip && (
                `${props.activityData.zip}`
              )}
            </Text>
            <TouchableOpacity
              style={{ width: 100, paddingTop: 8 }}
              onPress={async () => {
                Geocode.setApiKey('AIzaSyBoupsj11qhEKGUVQeJpp9tx4dB-GG2YjI');
                const destination = `${props.activityData.address_1},${props.activityData.city}, ${props.activityData.state} ${props.activityData.zip}`.replace(/[ ,.]/g, '+');
                RNLocation.configure({
                  distanceFilter: 5.0,
                });

                RNLocation.requestPermission({
                  ios: 'whenInUse',
                  android: {
                    detail: 'coarse',
                  },
                }).then((granted) => {
                  if (granted) {
                    RNLocation.subscribeToLocationUpdates(async (locations) => {
                      console.log(locations);
                      const currentLongitude = await JSON.stringify(locations[0].longitude);
                      const currentLatitude = await JSON.stringify(locations[0].latitude);
                      console.log(currentLatitude, currentLongitude);
                      Geocode.fromLatLng(currentLatitude, currentLongitude).then(
                        (response) => {
                          console.log(response);
                          const address = response.results[0].formatted_address.replace(/[ ,.]/g, '+');
                          const url = `https://www.google.com/maps/dir/${address}/${destination}`;
                          console.log(url);
                          Linking.openURL(url);
                        },
                        (error) => {
                          console.error(error);
                        },
                      );
                    });
                  }
                });
              }}
            >
              <Text style={styles.linkButton}>
                Directions
              </Text>
            </TouchableOpacity>
            {
                props.activityData.status === 'Open'
                || props.activityData.status === 'Open_Rejecte'
                || props.activityData.status === 'Open_Partial'
                  ? (
                    <View style={{ paddingTop: 32, alignItems: 'center' }}>
                      <Button
                        bgColor={colors.green}
                        style={{ width: '80%' }}
                        onPress={() => {
                          props.navigation.navigate('DetailsPreInstall');
                        }}
                        textColor={colors.white}
                        textStyle={{ fontSize: 20 }}
                        caption="Begin Work Order"
                      />
                    </View>
                  )
                  : (
                    null
                  )
            }
          </View>
        </View>
        {
          props.status !== 'Open' && (
            <React.Fragment>
              <ActivityStatus status={props.activityData.status} />
              <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
            </React.Fragment>
          )
        }
        <ActivityTitle title="Details" />
        <View style={{ backgroundColor: colors.lightGray, paddingVertical: 24 }}>
          <View style={styles.scrollContainer}>
            {
              <View style={{ width: '100%' }}>
                {
                  props.activityData.scope_of_work_app_active === 'true' && (
                    <View>
                      <Text>Scope of Work</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.scope_of_work}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.special_instructions_app_active === 'true' && (
                    <View>
                      <Text>Special Instructions</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.special_instructions}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.installation_hours_app_active === 'true' && (
                    <View>
                      <Text>Hours of Installation</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.installation_hours}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.union_reqs_app_active === 'true' && (
                    <View>
                      <Text>Union Requirements</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.union_reqs}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.disposal_reqs_app_active === 'true' && (
                    <View>
                      <Text>Disposal Requirements</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.disposal_reqs}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.material_delivery_shipping_app_active === 'true' && (
                    <View>
                      <Text>Material Delivery / Shipping</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.material_delivery_shipping}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.specialty_trades_req_app_active === 'true' && (
                    <View>
                      <Text>Specialty Trades Required</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.specialty_trades_req}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.activityData.client_onsite_app_active === 'true' && (
                    <View>
                      <Text>Client Onsite?</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.activityData.client_onsite}
                        </Text>
                      </View>
                    </View>
                  )
                }
              </View>
            }
            {
                props.activityData.status === 'Open'
                || props.activityData.status === 'Open_Rejecte'
                || props.activityData.status === 'Open_Partial'
                || props.activityData.status === 'Partial'
                || props.activityData.status === 'Failed'
                  ? (
                    null
                  )
                  : (
                    <View>
                      <Button
                        primary
                        onPress={() => props.navigation.navigate('DetailsPartial')}
                        bgColor={colors.blue}
                        textColor="white"
                        caption="Partial Installation"
                      />
                      <Button
                        style={{ marginTop: 24 }}
                        bgColor={colors.blue}
                        onPress={() => props.navigation.navigate('DetailsFail')}
                        textColor="white"
                        caption="Failed Installation"
                      />
                    </View>
                  )
            }
          </View>
        </View>
      </ScrollView>
      <PartialModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray,
  },
  detailStatic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.white,
  },
  detailDescription: {
    backgroundColor: 'white',
    padding: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  scrollContainer: {
    paddingTop: 8,
    paddingHorizontal: 24,
  },
  linkButton: {
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  activityHeader: {
    color: colors.primary,
    fontSize: 24,
    paddingTop: 20,
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
