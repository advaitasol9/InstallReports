import React, { Component } from 'react';
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

export default class WorkOrderManagerView extends Component {

  constructor(props) {
    super(props);
    uploadedImagesCount = 0;
    isSignatureUploaded = false;
    this.state = {
      isSubmitBtnDisabled: true,
      isLoading: false
    };
  }

  updateAnswers = () => {
    let isAllRequiredQuestionsAnswered = true;
    const managerQuestions = this.props.activityData.manager_questions_answers;
    managerQuestions.forEach(question => {
      if (question.required) {
        if (question.type === "signature" && this.props.signature.length == 0) {
          isAllRequiredQuestionsAnswered = false;
        } else if (question.allow_photos && this.props.photos.filter(photo => photo.order == question.order).length == 0) {
          isAllRequiredQuestionsAnswered = false;
        }
        else if (question.type === "photo" && this.props.photos.filter(photo => photo.order == question.order).length == 0) {
          isAllRequiredQuestionsAnswered = false;
        }
        if (["checklist", "freeform", "dropdown"].includes(question.type)) {
          if ((!question.answers || (question.answers == "" || question.answers.length == 0))) {
            isAllRequiredQuestionsAnswered = false;
          } else if (question.allow_photos && this.props.photos.filter(photo => photo.order == question.order).length == 0) {
            isAllRequiredQuestionsAnswered = false;
          }
        }
      }
    });
    this.setState({
      isSubmitBtnDisabled: !isAllRequiredQuestionsAnswered
    })
  }


  saveManagerQuestionAnswers = async () => {
    if (this.uploadedImagesCount == this.props.photos.length && this.isSignatureUploaded) {
      await apiPatchAnswers(
        `activities/${this.props.activityData.id}`,
        `manager_questions_answers=${JSON.stringify(this.props.activityData.manager_questions_answers)}`,
        this.props.token,
      ).then((response) => {
        apiChangeStatus('Complete', this.props.activityId, this.props.token)
          .then((response) => {
            this.setState({
              isLoading: false
            });
            this.props.setModalVisible(true);
          }).catch(err => {
            this.setState({
              isLoading: false
            });
          });
      });
    }
  }

  render() {
    if (this.props.isLoading === false) {
      return (
        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          style={styles.container}
        >
          <StatusBar backgroundColor={colors.lightGray} />
          <NavigationEvents
            onWillFocus={() => {
              console.log(this.props);
              let installerQuestions = [];
              try {
                installerQuestions = JSON.parse(this.props.activityData.installer_questions_answers);
              } catch (e) {
                installerQuestions = this.props.activityData.installer_questions_answers;
              }
              if (installerQuestions.length == 0 ||
                installerQuestions.filter(answer => (answer.answers !== "") || (answer.answers.length > 0)).length < installerQuestions.length) {
                this.props.setIsIncompleteOpen(true);
              }
            }}
            onWillBlur={() => this.props.setIsIncompleteOpen(false)}
          />
          <Header
            navigation={this.props.navigation}
            sideBar
          />
          <ScrollView style={{ width: '100%' }}>
            <ActivityInfoSection
              navigation={this.props.navigation}
              activityData={this.props.activityData}
            />
            <ActivityStatus status={this.props.activityData.status} />
            <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
            <ActivityTitle title="Manager on Duty Feedback" />
            <View style={{ backgroundColor: colors.lightGray, width: '100%' }}>
              <View style={[styles.scrollContainer, { borderBottomWidth: 0 }]}>
                <QuestionsList
                  questions={this.props.activityData.manager_questions_answers}
                  photos={this.props.photos}
                  addPhoto={this.props.addPhoto}
                  screen="Manager"
                  setUpdate={this.props.setUpdate}
                  update={this.props.update}
                  updateAnswers={this.updateAnswers}
                  setSignature={this.props.setSignature}
                />
                <Button
                  bgColor={colors.green}
                  onPress={async () => {
                    this.setState({
                      isLoading: true
                    });
                    this.uploadedImagesCount = 0;
                    if (this.props.photos.length > 0) {
                      this.props.photos.forEach((item) => {
                        apiGet('aws-s3-presigned-urls', this.props.token).then((res) => {
                          RNFetchBlob.fetch('PUT', res.data.url, {
                            'security-token': this.props.token,
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
                                    this.props.token,
                                  ).then((fileRes) => {
                                    this.props.activityData.manager_questions_answers
                                      .forEach((question, index) => {
                                        if (question.order === item.order) {
                                          if (question.type == "photo") {
                                            if (this.props.activityData.manager_questions_answers[index].answers == undefined) {
                                              this.props.activityData.manager_questions_answers[index].answers = [fileRes.data.id];
                                            } else {
                                              this.props.activityData.manager_questions_answers[index].answers.push(fileRes.data.id);
                                            }
                                          } else {
                                            if (this.props.activityData.manager_questions_answers[index].photo == undefined) {
                                              this.props.activityData.manager_questions_answers[index].photo = [fileRes.data.id];
                                            } else {
                                              this.props.activityData.manager_questions_answers[index].photo.push(fileRes.data.id);
                                            }
                                          }
                                        }
                                      });
                                    this.uploadedImagesCount = photoIndex + 1;
                                    this.saveManagerQuestionAnswers();
                                  }).catch(err => {
                                    this.setState({
                                      isLoading: false
                                    });
                                  });
                                });
                            })
                            .catch((err) => {
                              this.setState({
                                isLoading: false
                              });
                              console.log(err);
                            });
                        }).catch(err => {
                          this.setState({
                            isLoading: false
                          });
                        });
                      });
                    }
                    if (this.props.signature.length == 1) {
                      let signatureQuestionIndex = this.props.activityData.manager_questions_answers.findIndex(question => question.type == "signature");
                      let signatureQuestion = this.props.activityData.manager_questions_answers[signatureQuestionIndex];
                      if (signatureQuestionIndex != -1) {
                        apiGet('aws-s3-presigned-urls', this.props.token).then((res) => {
                          RNFetchBlob.fetch('PUT', res.data.url, {
                            'security-token': this.props.token,
                            'Content-Type': 'application/octet-stream',
                          }, this.props.signature[0])
                            .then(() => {
                              const formData = new FormData();
                              formData.append('file_type', 'image/jpeg');
                              formData.append('name', signatureQuestion.text);
                              formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                              formData.append('size', this.props.signature[0].length);
                              apiPostImage(
                                `files`,
                                formData, this.props.token,
                              ).then(fileRes => {
                                signatureQuestion.answers = fileRes.data.id;
                                this.isSignatureUploaded = true;
                                this.saveManagerQuestionAnswers();
                              }).catch(err => {
                                this.setState({
                                  isLoading: false
                                });
                              });
                            })
                            .catch((err) => {
                              this.setState({
                                isLoading: false
                              });
                              console.log(err);
                            });
                        }).catch(err => {
                          this.setState({
                            isLoading: false
                          });
                        });
                      }
                    } else {
                      this.isSignatureUploaded = true;
                      this.saveManagerQuestionAnswers();
                    }
                  }}
                  textColor={colors.white}
                  textStyle={{ fontSize: 20 }}
                  isLoading={this.state.isLoading}
                  caption="Submit"
                  bgColor={
                    (this.state.isSubmitBtnDisabled)
                      ? '#b1cec1'
                      : colors.green
                  }
                  disabled={this.state.isSubmitBtnDisabled}
                />
              </View>
            </View>
          </ScrollView>
          <ManagerModal />
          {this.props.isIncompleteOpen &&
            <IncompleteModal close={() => this.props.setIsIncompleteOpen(false)} />
          }
        </KeyboardAvoidingView >
      );
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
