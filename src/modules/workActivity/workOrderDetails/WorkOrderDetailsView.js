// @flow
import React from 'react';
import {
  StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView,
} from 'react-native';
import { colors } from '../../../styles';
import { Button, Header } from '../../../components';

const saveChanges = (props) => {
  if (!props.connectionStatus) {
    const { changes } = props;
    let matches = 0;
    if (changes.length === 0) {
      changes.push({
        activityId: props.navigation.state.params.activityId,
      });
      props.setChanges(changes);
      props.setChangesInOffline(1);
    } else {
      for (let i = 0; i < changes.length; i += 1) {
        if (changes[i].activityId === props.navigation.state.params.activityId) {
          matches += 1;
          break;
        }
      }
      if (matches === 0) {
        changes.push({
          activityId: props.navigation.state.params.activityId,
        });
        props.setChanges(changes);
        props.setChangesInOffline(changes.length);
      }
    }
  } else {
    console.log('Send changes');
  }
};

export default function WorkActivityView(props) {
  console.log(props);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
        sideBar
      />
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 32,
          backgroundColor: colors.white,
        }}
      >
        <View style={{ width: '100%', justifyContent: 'flex-start' }}>
          <TouchableOpacity style={{ width: 100 }} onPress={() => props.navigation.navigate('Work Order')}>
            <Text
              style={{
                color: colors.primary,
                textDecorationLine: 'underline',
                textDecorationColor: colors.primary,
              }}
            >
              Back to list
            </Text>
          </TouchableOpacity>
          <Text style={{ color: colors.primary, fontSize: 24, paddingTop: 20 }}>
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
          <TouchableOpacity style={{ width: 100,  paddingTop: 8 }} onPress={() => props.navigation.navigate('Work Order')}>
            <Text
              style={{
                color: colors.primary,
                textDecorationLine: 'underline',
                textDecorationColor: colors.primary,
              }}
            >
              Directions
            </Text>
          </TouchableOpacity>
          <View style={{ paddingTop: 32, alignItems: 'center' }}>
            <Button style={{ width: '80%' }} onPress={() => saveChanges(props)}>
              <Text style={{ color: 'white' }}>Begin Work Order</Text>
            </Button>
          </View>
        </View>
      </View>
      <View style={{ width: '100%', backgroundColor: colors.grey }}>
        <View style={{ width: '100%', backgroundColor: colors.blue, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16, paddingVertical: 12 }}>Work Order Details</Text>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: colors.lightGray, paddingVertical: 24 }}>
        <View style={{ paddingTop: 12, paddingHorizontal: 24, paddingBottom: 32 }}>
          <View>
            <Text>
              Scope of Work
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida elit sit amet orci sagittis, vel ultrices metus consectetur. In ex augue, congue eget enim vel, iaculis commodo mi. Phasellus egestas lobortis metus vitae rhoncus. Nullam volutpat egestas ante, et convallis nulla rutrum sit amet. Nulla congue libero at mi gravida iaculis.
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Special Instructions
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida elit sit amet orci sagittis, vel ultrices metus consectetur. In ex augue, congue eget enim vel, iaculis commodo mi. Phasellus egestas lobortis metus vitae rhoncus. Nullam volutpat egestas ante, et convallis nulla rutrum sit amet. Nulla congue libero at mi gravida iaculis.
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Hours of Installation
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                After store hours
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Union Requirements
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                Non-Union
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Scope of Work
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                Back on delivery truck
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Material Delivery/Shipping
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                White Glove Delivery to store
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Specially Trades Required
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                No
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Client Onsite
            </Text>
            <View style={{ backgroundColor: 'white', padding: 8, marginTop: 8, marginBottom: 12 }}>
              <Text>
                Yes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
});
