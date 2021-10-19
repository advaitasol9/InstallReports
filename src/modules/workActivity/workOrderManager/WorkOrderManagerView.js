import Geolocation from '@react-native-community/geolocation';
import React, { Component } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Text, PermissionsAndroid, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { ActivityInfoSection, ActivityStatus, ActivityTitle, Button, Header, IncompleteModal, ManagerModal, QuestionsList } from '../../../components';
import { colors } from '../../../styles';

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : '';

export default class WorkOrderManagerView extends Component {
  constructor(props) {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.getCurrentPosition(
        position => {
          props.geoLocation.lat = position.coords.latitude;
          props.geoLocation.lon = position.coords.longitude;
        },
        error => {
          console.log('map error: ', error);
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(res => {
        if (res === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            info => {
              props.geoLocation.lat = info.coords.latitude;
              props.geoLocation.lon = info.coords.longitude;
            },
            error => {
              console.error('faled');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000
            }
          );
        }
      });
    }

    super(props);
  }

  render() {
    if (this.props.isLoading === false) {
      if (this.props.errorWhileInit) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: '#797979' }}>Something went wrong.</Text>

            <Text
              style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 18 }}
              onPress={() => {
                this.props.setErrorWhileInit(false);
                this.props.setIsloading(true);
                this.props.initWorkOrder();
              }}
            >
              Try again
            </Text>
          </View>
        );
      } else if (this.props.isIncompleteOpen) {
        return (
          <IncompleteModal
            close={() => {
              this.props.setDidUserCloseModal(true);
              this.props.setIsIncompleteOpen(false);
            }}
          />
        );
      } else if (this.props.didUserCloseModal) {
        return null;
      } else {
        return (
          <KeyboardAvoidingView behavior={keyboardBehavior} style={styles.container}>
            <StatusBar backgroundColor={colors.lightGray} />
            <NavigationEvents onWillFocus={() => this.props.initWorkOrder()} onWillBlur={() => this.props.setIsIncompleteOpen(false)} />
            <Header navigation={this.props.navigation} sideBar />
            <ScrollView style={{ width: '100%' }}>
              <ActivityInfoSection navigation={this.props.navigation} activityData={this.props.activityData} />
              <ActivityStatus status={this.props.activityData.status} />
              <View
                style={{
                  width: '100%',
                  height: 24,
                  backgroundColor: colors.white
                }}
              />
              <ActivityTitle title="Manager on Duty Feedback" />
              <View style={{ backgroundColor: colors.lightGray, width: '100%' }}>
                <View style={[styles.scrollContainer, { borderBottomWidth: 0 }]}>
                  <QuestionsList
                    questions={this.props.activityData.manager_questions_answers}
                    questions_photos={this.props.activityData.installer_questions_photos}
                    photos={this.props.photos}
                    addPhoto={this.props.addPhoto}
                    screen="Manager"
                    setUpdate={this.props.setUpdate}
                    update={this.props.update}
                    updateAnswers={() => this.props.validateAnswers()}
                    setSignature={this.props.setSignature}
                  />
                  <Button
                    bgColor={colors.green}
                    onPress={() => this.props.onSubmit()}
                    textColor={colors.white}
                    textStyle={{ fontSize: 20 }}
                    isLoading={this.props.submitButtonLoading}
                    caption="Submit"
                    bgColor={this.props.answersValid || this.props.submitButtonLoading ? '#b1cec1' : colors.green}
                    disabled={this.props.answersValid || this.props.submitButtonLoading}
                  />
                </View>
              </View>
            </ScrollView>
            <ManagerModal />
          </KeyboardAvoidingView>
        );
      }
    } else {
      return (
        <View style={styles.backgroundActivity}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingVertical: 16
  },
  documentContainer: {
    width: '45%',
    height: 150,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  inputStyle: {
    fontSize: 14,
    marginTop: 32,
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top'
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A'
  },
  functionButton: {
    margin: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sketchContainer: {
    height: 200,
    paddingHorizontal: 0,
    paddingVertical: 0
  }
});
