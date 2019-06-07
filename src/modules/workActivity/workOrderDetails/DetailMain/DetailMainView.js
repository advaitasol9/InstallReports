// @flow
import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import { colors } from '../../../../styles';
import { Button } from '../../../../components';
import { apiPost } from '../../../../core/api';


export default function WorkActivityView(props) {
  return (
    <React.Fragment>
      <View
        style={styles.detailStatic}
      >
        <View style={{ width: '100%', justifyContent: 'flex-start' }}>
          <TouchableOpacity style={{ width: 100 }} onPress={() => props.navigation.navigate('Work Order')}>
            <Text style={styles.linkButton}>
              Back to list
            </Text>
          </TouchableOpacity>
          <Text style={styles.activityHeader}>
            Work Order #{props.navigation.state.params.activityId}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 20, paddingTop: 8 }}>
            Project: Galaxy 25zx Sales Display
          </Text>
          <Text style={{ paddingTop: 8 }}>
            Verizon Wireless - Yorkville #685
          </Text>
          <Text style={{ paddingTop: 8 }}>
            122 W Veterans Pkwy, Yorkville, IL 60560
          </Text>
          <TouchableOpacity style={{ width: 100, paddingTop: 8 }} onPress={() => props.navigation.navigate('Work Order')}>
            <Text style={styles.linkButton}>
              Directions
            </Text>
          </TouchableOpacity>
          {
            props.inProgress
              ? (
                null
              )
              : (
                <View style={{ paddingTop: 32, alignItems: 'center' }}>
                  <Button
                    bgColor={colors.green}
                    style={{ width: '80%' }}
                    onPress={() => {
                      props.saveChanges();
                      apiPost('test-app-1/spectrum/activities/1/status/In_Progress', {}, props.token)
                        .then((response) => {
                          props.setInProgress(true);
                          console.log(response);
                        });
                    }}
                  >
                    <Text style={{ color: 'white' }}>Begin Work Order</Text>
                  </Button>
                </View>
              )
          }
        </View>
      </View>
      <View style={{ width: '100%' }}>
        {
          props.inProgress
            ? (
              <View style={{ width: '100%', backgroundColor: colors.yellow, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16, paddingVertical: 12 }}>Work Order - In Progress</Text>
              </View>
            )
            : (
              <View style={{ width: '100%', backgroundColor: colors.blue, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16, paddingVertical: 12 }}>Work Order Details</Text>
              </View>
            )
        }
      </View>
      <ScrollView style={{ backgroundColor: colors.lightGray, paddingVertical: 24 }}>
        <View style={styles.scrollContainer}>
          <View>
            <Text>Scope of Work</Text>
            <View style={styles.detailDescription}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida elit sit amet orci sagittis, vel ultrices metus consectetur. In ex augue, congue eget enim vel, iaculis commodo mi. Phasellus egestas lobortis metus vitae rhoncus. Nullam volutpat egestas ante, et convallis nulla rutrum sit amet. Nulla congue libero at mi gravida iaculis.
              </Text>
            </View>
          </View>
          <View>
            <Text>Special Instructions</Text>
            <View style={styles.detailDescription}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida elit sit amet orci sagittis, vel ultrices metus consectetur. In ex augue, congue eget enim vel, iaculis commodo mi. Phasellus egestas lobortis metus vitae rhoncus. Nullam volutpat egestas ante, et convallis nulla rutrum sit amet. Nulla congue libero at mi gravida iaculis.
              </Text>
            </View>
          </View>
          <View>
            <Text>Hours of Installation</Text>
            <View style={styles.detailDescription}>
              <Text>After store hours</Text>
            </View>
          </View>
          <View>
            <Text>Union Requirements</Text>
            <View style={styles.detailDescription}>
              <Text>Non-Union</Text>
            </View>
          </View>
          <View>
            <Text>Scope of Work</Text>
            <View style={styles.detailDescription}>
              <Text>Back on delivery truck</Text>
            </View>
          </View>
          <View>
            <Text>Material Delivery/Shipping</Text>
            <View style={styles.detailDescription}>
              <Text>White Glove Delivery to store</Text>
            </View>
          </View>
          <View>
            <Text>Specially Trades Required</Text>
            <View style={styles.detailDescription}>
              <Text>No</Text>
            </View>
          </View>
          <View>
            <Text>Client Onsite</Text>
            <View style={styles.detailDescription}>
              <Text>Yes</Text>
            </View>
          </View>
          {
            props.inProgress
              ? (
                <View>
                  <Button
                    primary
                    onPress={() => props.setScreen('Partial')}
                    bgColor={colors.blue}
                  >
                    <Text style={{ color: 'white' }}>Partial Installation</Text>
                  </Button>
                  <Button
                    style={{ marginTop: 24 }}
                    bgColor={colors.blue}
                    onPress={() => props.setScreen('Failed')}
                  >
                    <Text style={{ color: 'white' }}>Failed Installation</Text>
                  </Button>
                </View>
              )
              : (
                null
              )
          }
        </View>
      </ScrollView>
    </React.Fragment>
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
    padding: 32,
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
    paddingBottom: 48,
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
