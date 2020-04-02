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
import RNFetchBlob from 'rn-fetch-blob';

import { colors } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
  QuestionsList,
  Button,
} from '../../../components';
import {
  apiPatchAnswers, apiGet, apiPostImage,
} from '../../../core/api';

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : '';

export default function WorkOrderQuestionsView(props) {
  if (props.isLoading === true) {
    return (
      <View style={styles.backgroundActivity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={keyboardBehavior}
      style={styles.container}
    >
      <StatusBar backgroundColor={colors.lightGray} />
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
          <View style={styles.scrollContainer}>
            <QuestionsList
              questions={props.activityData.installer_questions_answers}
              photos={props.photos}
              addPhoto={props.addPhoto}
              screen="Questions"
              setUpdate={props.setUpdate}
              update={props.update}
            />
            <View style={{ marginTop: 24 }}>
              <Button
                bgColor={colors.green}
                onPress={async () => {
                  if (props.photos.length > 0) {
                    props.photos.forEach((item) => {
                      apiGet('http://142.93.1.107:9002/api/test-app-1/aws-s3-presigned-urls', props.token).then((res) => {
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
                                  'http://142.93.1.107:9001/test-app-1/files',
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
                    `test-app-1/activities/${props.activityData.id}`,
                    `installer_questions_answers=${JSON.stringify(props.activityData.installer_questions_answers)}`,
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
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Submit"
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 16,
  },
  documentContainer: {
    width: '45%',
    height: 150,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    color: colors.red,
    fontSize: 48,
    marginTop: 16,
  },
});
