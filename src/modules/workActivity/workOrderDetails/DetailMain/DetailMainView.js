// @flow
import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Linking } from 'react-native';
import Geocode from 'react-geocode';
import RNLocation from 'react-native-location';

import { colors } from '../../../../styles';
import { Button, PartialModal, Header, ActivityTitle, ActivityStatus } from '../../../../components';

import { BackHandler } from 'react-native';

export default class DetailMainView extends Component {
  linkState = true;

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  handleDirectionLink = () => {
    Geocode.setApiKey('AIzaSyBoupsj11qhEKGUVQeJpp9tx4dB-GG2YjI');
    const destination = `${this.props.activityData.address_1},${this.props.activityData.city}, ${this.props.activityData.state} ${this.props.activityData.zip}`.replace(
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
          const currentLongitude = await JSON.stringify(locations[0].longitude);
          const currentLatitude = await JSON.stringify(locations[0].latitude);

          const geocodeRes = await Geocode.fromLatLng(currentLatitude, currentLongitude);
          const address = geocodeRes.results[0].formatted_address.replace(/[ ,.]/g, '+');
          const url = `https://www.google.com/maps/dir/${address}/${destination}`;

          try {
            await Linking.openURL(url);
          } catch (error) {
            console.log(error);
          }

          if (unsubscribe) {
            unsubscribe();
          }
        });
      }
    });
  };

  handleBackButtonClick = () => {
    if (this.props.navigation.isFocused()) {
      this.props.setActivityId(null);
      this.props.navigation.navigate('Work Order');
    } else {
      this.props.navigation.goBack(null);
    }
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  render() {
    if (this.props.isLoading === true) {
      return (
        <View style={styles.backgroundActivity}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} />
        <Header connectionStatus={this.props.connectionStatus} changesNum={this.props.changes.length} navigation={this.props.navigation} sideBar indicator />
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.detailStatic}>
            <View style={{ width: '100%', justifyContent: 'flex-start' }}>
              <TouchableOpacity
                style={{ width: 100 }}
                onPress={() => {
                  this.props.setActivityId(null);
                  this.props.navigation.navigate('Work Order');
                }}
              >
                <Text style={styles.linkButton}>Back to list</Text>
              </TouchableOpacity>
              <Text style={styles.activityHeader}>Work Order #{this.props.activityData.id}</Text>
              <Text style={{ color: colors.primary, fontSize: 20, paddingTop: 8 }}>
                Project: {this.props.activityData.items.length > 0 ? this.props.activityData.items[0].name : null}
              </Text>
              <Text style={{ paddingTop: 8 }}>
                {this.props.activityData.location && `${this.props.activityData.location}`}
                {this.props.activityData.store_name && ` - ${this.props.activityData.store_name}`}
                {this.props.activityData.store_id && ` #${this.props.activityData.store_id}`}
              </Text>
              <Text style={{ paddingTop: 8 }}>
                {this.props.activityData.address_1 && `${this.props.activityData.address_1}, `}
                {this.props.activityData.address_2 && `${this.props.activityData.address_2}, `}
                {this.props.activityData.city && `${this.props.activityData.city}, `}
                {this.props.activityData.state && `${this.props.activityData.state} `}
                {this.props.activityData.zip && `${this.props.activityData.zip}`}
              </Text>
              <TouchableOpacity style={{ width: 100, paddingTop: 8 }} onPress={this.handleDirectionLink}>
                <Text style={styles.linkButton}>Directions</Text>
                <Text style={styles.linkButton}></Text>
              </TouchableOpacity>
              {this.props.activityData.status == 'Assigned' ? (
                <View style={{ paddingTop: 32, alignItems: 'center' }}>
                  <Button
                    bgColor={colors.green}
                    style={{ width: 250 }}
                    onPress={() => {
                      this.props.navigation.navigate('DetailsPreInstall');
                    }}
                    textColor={colors.white}
                    textStyle={{ fontSize: 20 }}
                    caption="Begin Work Order"
                  />
                </View>
              ) : null}
            </View>
          </View>
          {this.props.activityData.status !== 'Assigned' && (
            <React.Fragment>
              <ActivityStatus status="In_Progress" />
              <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
            </React.Fragment>
          )}
          <ActivityTitle title="Details" />
          <View style={{ backgroundColor: colors.lightGray, paddingVertical: 24 }}>
            <View style={styles.scrollContainer}>
              {
                <View style={{ width: '100%' }}>
                  {this.props.activityData.scope_of_work_app_active === '1' && (
                    <View>
                      <Text>Scope of Work</Text>
                      <View style={styles.detailDescription}>
                        <Text textBreakStrategy="simple">{this.props.activityData.scope_of_work}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.special_instructions_app_active === '1' && (
                    <View>
                      <Text>Special Instructions</Text>
                      <View style={styles.detailDescription}>
                        <Text textBreakStrategy="simple">{this.props.activityData.special_instructions}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.installation_hours_app_active === '1' && (
                    <View>
                      <Text>Hours of Installation</Text>
                      <View style={styles.detailDescription}>
                        <Text>{this.props.activityData.installation_hours}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.union_reqs_app_active === '1' && (
                    <View>
                      <Text>Union Requirements</Text>
                      <View style={styles.detailDescription}>
                        <Text>{this.props.activityData.union_reqs}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.disposal_reqs_app_active === '1' && (
                    <View>
                      <Text>Disposal Requirements</Text>
                      <View style={styles.detailDescription}>
                        <Text>{this.props.activityData.disposal_reqs}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.material_delivery_shipping_app_active === '1' && (
                    <View>
                      <Text>Material Delivery / Shipping</Text>
                      <View style={styles.detailDescription}>
                        <Text>{this.props.activityData.material_delivery_shipping}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.specialty_trades_req_app_active === '1' && (
                    <View>
                      <Text>Specialty Trades Required</Text>
                      <View style={styles.detailDescription}>
                        <Text>{this.props.activityData.specialty_trades_req}</Text>
                      </View>
                    </View>
                  )}
                  {this.props.activityData.client_onsite_app_active === '1' && (
                    <View>
                      <Text>Client Onsite?</Text>
                      <View style={styles.detailDescription}>
                        <Text>{this.props.activityData.client_onsite}</Text>
                      </View>
                    </View>
                  )}
                </View>
              }
              {this.props.activityData.status === 'In_Progress' && (
                <View>
                  <Button
                    style={{ marginTop: 24 }}
                    bgColor={colors.blue}
                    onPress={() => this.props.navigation.navigate('DetailsFail')}
                    textColor="white"
                    caption="Failed Attempt"
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray
  },
  detailStatic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.white
  },
  detailDescription: {
    backgroundColor: 'white',
    padding: 8,
    marginTop: 8,
    marginBottom: 24
  },
  scrollContainer: {
    paddingTop: 8,
    paddingHorizontal: 24
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
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
