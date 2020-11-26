import React, { Component } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { ActivityInfoSection, ActivityStatus, ActivityTitle, Button, Header, QuestionsList } from '../../../components';
import NoOfflineWOMessage from '../../../components/NoOfflineWOMessage';
import { apiGet, apiPatchAnswers } from '../../../core/api';
import { colors } from '../../../styles';

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : '';

export default class WorkOrderQuestionsView extends Component {
  constructor(props) {
    super(props);
    this.uploadedImagesCount = 0;
    deletePhotoIds = [];
    isSignatureUploaded = false;
    this.state = {
      isLoading: false,
      showButton: true
    };
  }

  updateAnswers = () => {
    const installerQuestions = this.props.activityData.installer_questions_answers;
    if (!installerQuestions?.length) {
      return;
    }

    for (let i = 0; i < installerQuestions.length; i++) {
      const question = installerQuestions[i];
      if (!question.required) {
        continue;
      }

      if (question.type == 'signature' && !this.props.signature.length && !question.answers) {
        this.props.setIsSubmitBtnDisabled(true);
        return;
      }
      const noNewPhotos = !this.props.photos.find(p => p.order == question.order);
      const noExistingPhotos = !this.props.activityData.installer_questions_photos.find(p => p.order == question.order)?.data?.length;
      if (question.allow_photos && noNewPhotos && noExistingPhotos) {
        this.props.setIsSubmitBtnDisabled(true);
        return;
      }

      if (question.type == 'photo' && noNewPhotos && noExistingPhotos) {
        this.props.setIsSubmitBtnDisabled(true);
        return;
      }

      if (['checklist', 'freeform', 'dropdown'].includes(question.type) && !question.answers?.length) {
        this.props.setIsSubmitBtnDisabled(true);
        return;
      }
    }

    this.props.setIsSubmitBtnDisabled(false);
  };

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.backgroundActivity}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!this.props.activityData) {
      return <NoOfflineWOMessage navigation={this.props.navigation} setActivityId={this.props.setActivityId}></NoOfflineWOMessage>;
    }

    return (
      <KeyboardAvoidingView behavior={keyboardBehavior} style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} />
        <Header navigation={this.props.navigation} sideBar />
        <ScrollView style={{ width: '100%' }}>
          <ActivityInfoSection navigation={this.props.navigation} activityData={this.props.activityData} />
          <ActivityStatus status={this.props.activityData.status} />
          <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
          <ActivityTitle title="Installer Questions" />
          <View style={{ backgroundColor: colors.lightGray, width: '100%' }}>
            <View style={styles.scrollContainer}>
              <QuestionsList
                questions={this.props.activityData.installer_questions_answers}
                questions_photos={this.props.activityData.installer_questions_photos}
                photos={this.props.photos}
                addPhoto={this.props.addPhoto}
                screen="Questions"
                setUpdate={this.props.setUpdate}
                update={this.props.update}
                updateAnswers={this.updateAnswers}
                deleteInstallerPhotos={this.props.deletePhotos}
                setSignature={this.props.setSignature}
              />
              <View style={{ marginTop: 24 }}>
                <Button
                  textColor={colors.white}
                  textStyle={{ fontSize: 20 }}
                  caption="Update"
                  isLoading={this.props.isUpdateLoading}
                  bgColor={this.props.isUpdateLoading ? '#b1cec1' : colors.blue}
                  onPress={async () => {
                    this.props.updateQuestionAnswers();
                  }}
                />
                <Button
                  style={{ marginTop: 15 }}
                  onPress={() => this.props.submitQuestionAnswers()}
                  textColor={colors.white}
                  textStyle={{ fontSize: 20 }}
                  caption="Submit"
                  isLoading={this.props.isSubmitLoading}
                  bgColor={this.props.isSubmitBtnDisabled ? '#b1cec1' : colors.green}
                  disabled={this.props.isSubmitBtnDisabled}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingVertical: 16
  },
  documentContainer: {
    width: '45%',
    height: 150,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    color: colors.red,
    fontSize: 48,
    marginTop: 16
  }
});
