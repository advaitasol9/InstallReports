import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';

import { colors } from '../../../styles';
import {
  Header,
  Button,
  ManagerModal,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
  IncompleteModal,
  QuestionsList,
} from '../../../components';
import {
  apiPatchAnswers, apiGet, apiPostImage, apiChangeStatus,
} from '../../../core/api';

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : '';

export default function WorkOrderManagerView(props) {
  if (props.isLoading === true) {
    return (
      <View style={styles.backgroundActivity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (installerAnswers &&
    installerAnswers.filter(answer => answer !== null).length === installerAnswers.length) {
    props.setIsIncompleteOpen(false);
  }
  const installerAnswers = props.activityData.installer_questions_answers;

  return (
    <KeyboardAvoidingView
      behavior={keyboardBehavior}
      style={styles.container}
    >
      <StatusBar backgroundColor={colors.lightGray} />
      <NavigationEvents
        onWillFocus={() => {
          if (installerAnswers === null ||
            installerAnswers.filter(answer => answer !== null).length < installerAnswers.length) {
            props.setIsIncompleteOpen(true);
          }
        }}
        onWillBlur={() => props.setIsIncompleteOpen(false)}
      />
      <Header
        navigation={props.navigation}
        sideBar
      />
      <ScrollView style={{ width: '100%' }}>
        <ActivityInfoSection
          navigation={props.navigation}
          activityData={props.activityData}
        />
        <ActivityStatus status={props.activityData.status} />
        <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
        <ActivityTitle title="Manager on Duty Feedback" />
        <View style={{ backgroundColor: colors.lightGray, width: '100%' }}>
          <View style={[styles.scrollContainer, { borderBottomWidth: 0 }]}>
            <QuestionsList
              questions={props.activityData.manager_questions_answers}
              photos={props.photos}
              addPhoto={props.addPhoto}
              screen="Manager"
              setUpdate={props.setUpdate}
              update={props.update}
            />
            <Button
              bgColor={colors.green}
              onPress={async () => {
                if (props.photos.length > 0) {
                  props.photos.forEach((item) => {
                    apiGet('aws-s3-presigned-urls', props.token).then((res) => {
                      RNFetchBlob.fetch('PUT', res.data.url, {
                        'security-token': props.token,
                        'Content-Type': 'application/octet-stream',
                      }, RNFetchBlob.wrap(item.uri.replace('file://', '')))
                        .then(() => {
                          RNFetchBlob.fs.stat(item.uri.replace('file://', ''))
                            .then((stats) => {
                              const formData = new FormData();
                              formData.append('file_type', 'image/jpeg');
                              formData.append('name', stats.filename);
                              formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                              formData.append('size', stats.size);
                              apiPostImage(
                                'files',
                                formData,
                                props.token,
                              ).then(() => {
                                props.activityData.installer_questions_answers
                                  .forEach((question, index) => {
                                    if (question.order === item.order) {
                                      props.activityData.installer_questions_answers[index].photo.push(res.data.id);
                                    }
                                  });
                              });
                            });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    });
                  });
                }
                await apiPatchAnswers(
                  `activities/${props.activityData.id}`,
                  `installer_manager_answers=${JSON.stringify(props.activityData.installer_questions_answers)}`,
                  props.token,
                ).then((response) => {
                  if (response.status === 200) {
                    Alert.alert(
                      'Success',
                      'Your answer was added',
                      [
                        { text: 'Ok' },
                      ],
                    );
                  }
                });
                await apiChangeStatus('Complete', props.activityId, props.token)
                  .then((response) => {
                    const res = response.json();
                    if (res.data === null) {
                      props.navigation.navigate('Work Order');
                    }
                  });
                await props.setModalVisible(true);
              }}
              textColor={colors.white}
              textStyle={{ fontSize: 20 }}
              caption="Submit"
            />
          </View>
        </View>
      </ScrollView>
      <ManagerModal />
      {props.isIncompleteOpen &&
        <IncompleteModal close={() => props.setIsIncompleteOpen(false)} />
      }
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray,
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingVertical: 16,
  },
  documentContainer: {
    width: '45%',
    height: 150,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: 14,
    marginTop: 32,
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    margin: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sketchContainer: {
    height: 200,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
