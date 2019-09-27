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
import { apiChangeStatus } from '../../../../core/api';
import { apiGetJson } from '../../../../core/api';


export default function DetailMainView(props) {
  const saveChanges = () => {
    if (!props.connectionStatus) {
      const { changes } = props;
      let matches = 0;
      if (changes.length === 0) {
        changes.push({
          activityId: props.activityId,
        });
        props.setChanges(changes);
        props.setChangesInOffline(1);
      } else {
        for (let i = 0; i < changes.length; i += 1) {
          if (changes[i].activityId === props.activityId) {
            matches += 1;
            break;
          }
        }
        if (matches === 0) {
          changes.push({
            activityId: props.activityId,
          });
          props.setChanges(changes);
          props.setChangesInOffline(changes.length);
        }
      }
    } else {
      console.log('Send changes');
    }
  };

  if (props.isLoading === true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
              {props.activityData.notes} - {props.activityData.city} #685
            </Text>
            <Text style={{ paddingTop: 8 }}>
              {`${props.activityData.address_1}, ${props.activityData.city}, ${props.activityData.state} ${props.activityData.zip}`}
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
                || !props.inProgress
                  ? (
                    <View style={{ paddingTop: 32, alignItems: 'center' }}>
                      <Button
                        bgColor={colors.green}
                        style={{ width: '80%' }}
                        onPress={() => {
                          saveChanges();
                          // props.navigation.navigate('DetailsPreInstall');
                          apiChangeStatus('In_Progress', props.activityId, props.token)
                            .then((response) => {
                              console.log(response.json());
                              apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
                                .then((res) => {
                                  console.log(res);
                                  this.props.setActivityData(response.data);
                                  this.props.setIsloading(false);
                                });
                            });
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
              <ActivityStatus status={props.activityData.status.replace(/_/g, ' ')} />
              <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
            </React.Fragment>
          )
        }
        <ActivityTitle title="Details" />
        <View style={{ backgroundColor: colors.lightGray, paddingVertical: 24 }}>
          <View style={styles.scrollContainer}>
            {(props.details !== undefined) && (
              <View style={{ width: '100%' }}>
                {
                  props.details.f1 && (
                    <View>
                      <Text>f1</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f1}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f2 && (
                    <View>
                      <Text>f2</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f2}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f3 && (
                    <View>
                      <Text>f3</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f3}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f4 && (
                    <View>
                      <Text>f4</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f4}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f5 && (
                    <View>
                      <Text>f5</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f5}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f6 && (
                    <View>
                      <Text>f6</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f6}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f7 && (
                    <View>
                      <Text>f7</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f7}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f8 && (
                    <View>
                      <Text>f8</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f8}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f9 && (
                    <View>
                      <Text>f9</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f9}
                        </Text>
                      </View>
                    </View>
                  )
                }
                {
                  props.details.f10 && (
                    <View>
                      <Text>f10</Text>
                      <View style={styles.detailDescription}>
                        <Text>
                          {props.details.f10}
                        </Text>
                      </View>
                    </View>
                  )
                }
              </View>
            )}
            {
                props.activityData.status === 'Open'
                || props.activityData.status === 'Open_Rejecte'
                || props.activityData.status === 'Open_Partial'
                || props.activityData.status === 'Partial'
                || props.activityData.status === 'Failed'
                || !props.inProgress
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
});
