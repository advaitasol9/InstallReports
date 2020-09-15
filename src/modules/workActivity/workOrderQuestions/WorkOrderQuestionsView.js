import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import { colors, commonStyles } from '../../../styles';

import { Header, ActivityInfoSection, ActivityTitle, ActivityStatus, QuestionsList, Button } from '../../../components';
import { apiPatchAnswers, apiGet, apiPostImage, apiGetJson } from '../../../core/api';
import { clearPhotos } from './WorkOrderQuestionsState';

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : '';

export default class WorkOrderQuestionsView extends Component {
  constructor(props) {
    super(props);
    this.uploadedImagesCount = 0;
    deletePhotoIds = [];
    isSignatureUploaded = false;
    this.state = {
      isSubmitBtnDisabled: false,
      isUpdateLoading: false,
      isLoading: false,
      showButton: true
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.updateAnswers();
    }, 1000);
  }

  updateAnswers = () => {
    let isAllRequiredQuestionsAnswered = true;
    const installerQuestions = this.props.activityData.installer_questions_answers;
    installerQuestions.forEach(question => {
      if (question.required) {
        if (question.type === 'signature' && this.props.signature.length == 0 && !question.answers) {
          isAllRequiredQuestionsAnswered = false;
        } else if (
          question.allow_photos &&
          this.props.photos.filter(photo => photo.order == question.order).length == 0 &&
          (this.props.activityData.installer_questions_photos.filter(data => {
            if (data.question_order_id == question.order) {
              return data;
            }
          })[0] == undefined
            ? true
            : this.props.activityData.installer_questions_photos.filter(dataz => {
                if (dataz.question_order_id == question.order) {
                  return dataz;
                }
              })[0].data.length == 0)
        ) {
          isAllRequiredQuestionsAnswered = false;
        } else if (
          question.type === 'photo' &&
          this.props.photos.filter(photo => photo.order == question.order).length == 0 &&
          (this.props.activityData.installer_questions_photos.filter(data => {
            if (data.question_order_id == question.order) {
              return data;
            }
          })[0] == undefined
            ? true
            : this.props.activityData.installer_questions_photos.filter(dataz => {
                if (dataz.question_order_id == question.order) {
                  return dataz;
                }
              })[0].data.length == 0)
        ) {
          isAllRequiredQuestionsAnswered = false;
        }
        if (['checklist', 'freeform', 'dropdown'].includes(question.type)) {
          if (!question.answers || question.answers == '' || question.answers.length == 0) {
            isAllRequiredQuestionsAnswered = false;
          } else if (
            question.allow_photos &&
            this.props.photos.filter(photo => photo.order == question.order).length == 0 &&
            (this.props.activityData.installer_questions_photos.filter(data => {
              if (data.question_order_id == question.order) {
                return data;
              }
            })[0] == undefined
              ? true
              : this.props.activityData.installer_questions_photos.filter(dataz => {
                  if (dataz.question_order_id == question.order) {
                    return dataz;
                  }
                })[0].data.length == 0)
          ) {
            isAllRequiredQuestionsAnswered = false;
          }
        }
      }
    });
    this.setState({
      isSubmitBtnDisabled: !isAllRequiredQuestionsAnswered,
      showButton: !isAllRequiredQuestionsAnswered
    });
  };

  deleteInstallerPhotos = photo_data => {
    this.props.activityData.installer_questions_photos.map(data => {
      data.data.filter((e, index) => {
        if (e.file_id === photo_data.file_id) {
          deletePhotoIds.push(e.file_id);
          data.data.splice(index, 1);
        }
      });
    });
  };

  saveInstallerQuestionAnswers = async () => {
    deletePhotoIds.map(deleteId => {
      this.props.activityData.installer_questions_answers.map((data, index1) => {
        if (data.type == 'photo') {
          if (data.answers != undefined) {
            data.answers.filter((e, index) => {
              if (e == deleteId) {
                data.answers.splice(index, 1);
              }
            });
          }
        } else {
          if (data.photo != undefined) {
            data.photo.filter((e, index) => {
              if (e == deleteId) {
                data.photo.splice(index, 1);
              }
            });
          }
        }
      });
    });
    var photoIds = [];
    var installer_answers_photos = [];
    this.props.activityData.installer_questions_answers.map(data => {
      if (data.type == 'photo') {
        var tempIds = [];
        var dataArray = [];
        if (data.answers != undefined) {
          data.answers.map(item => {
            photoIds.push(item);
            tempIds.push(item);
          });
          tempIds.map(dataId => {
            dataArray.push({ file_id: dataId });
          });
          installer_answers_photos.push({
            question_order_id: data.order,
            data: dataArray
          });
        }
      } else if (data.type == 'signature') {
        if (data.answers != undefined) {
          var tempIds = [];
          var dataArray = [];
          photoIds.push(data.answers);
          tempIds.push(data.answers);
          tempIds.map(dataId => {
            dataArray.push({ file_id: data.answers });
          });
          installer_answers_photos.push({
            question_order_id: data.order,
            data: dataArray
          });
        }
      } else {
        var tempIds = [];
        var dataArray = [];
        if (data.photo != undefined) {
          data.photo.map(item => {
            photoIds.push(item);
            tempIds.push(item);
          });
          tempIds.map(dataId => {
            dataArray.push({ file_id: dataId });
          });

          installer_answers_photos.push({
            question_order_id: data.order,
            data: dataArray
          });
        }
      }
    });

    await apiGet(`files?search={"id":[` + photoIds + `]}`, this.props.token).then(res => {
      if (res.data) {
        installer_answers_photos.map(questions => {
          questions.data.map((photo, index) => {
            res.data.filter(e => {
              e.id === photo.file_id ? (questions.data[index] = { url: e.s3_location, file_id: e.id }) : [];
            });
          });
        });
      }
    });
    this.props.activityData.installer_questions_photos = installer_answers_photos;
    if (this.uploadedImagesCount == this.props.photos.length && this.isSignatureUploaded) {
      this.setState({
        isLoading: true
      });
      this.uploadedImagesCount = 0;
      await apiPatchAnswers(
        `activities/${this.props.activityData.id}`,
        {
          installer_questions_answers: JSON.stringify(this.props.activityData.installer_questions_answers)
        },
        this.props.token
      ).then(response => {
        this.updateAnswers();
        this.setState({
          isLoading: false
        });
        this.uploadedImagesCount = 0;
        isSignatureUploaded = false;
        this.state.isSubmitBtnDisabled = false;
        if (response.status === 200) {
          this.props.addPhoto([]);
          this.props.setSignature([]);
          Alert.alert('Success', 'Your answer(s) have been received.', [{ text: 'Ok' }]);
        }
      });
    } else {
      //this.state.isSubmitBtnDisabled = true;
      this.setState({
        isLoading: false
      });
    }
  };

  updateInstallerQuestionAnswers = async () => {
    deletePhotoIds.map(deleteId => {
      this.props.activityData.installer_questions_answers.map((data, index1) => {
        if (data.type == 'photo') {
          if (data.answers != undefined) {
            data.answers.filter((e, index) => {
              if (e == deleteId) {
                data.answers.splice(index, 1);
              }
            });
          }
        } else {
          if (data.photo != undefined) {
            data.photo.filter((e, index) => {
              if (e == deleteId) {
                data.photo.splice(index, 1);
              }
            });
          }
        }
      });
    });
    var photoIds = [];
    var installer_answers_photos = [];
    this.props.activityData.installer_questions_answers.map(data => {
      if (data.type == 'photo') {
        var tempIds = [];
        var dataArray = [];
        if (data.answers != undefined) {
          data.answers.map(item => {
            photoIds.push(item);
            tempIds.push(item);
          });
          tempIds.map(dataId => {
            dataArray.push({ file_id: dataId });
          });
          installer_answers_photos.push({
            question_order_id: data.order,
            data: dataArray
          });
        }
      } else if (data.type == 'signature') {
        if (data.answers != undefined) {
          var tempIds = [];
          var dataArray = [];
          photoIds.push(data.answers);
          tempIds.push(data.answers);
          tempIds.map(dataId => {
            dataArray.push({ file_id: data.answers });
          });
          installer_answers_photos.push({
            question_order_id: data.order,
            data: dataArray
          });
        }
      } else {
        var tempIds = [];
        var dataArray = [];
        if (data.photo != undefined) {
          data.photo.map(item => {
            photoIds.push(item);
            tempIds.push(item);
          });
          tempIds.map(dataId => {
            dataArray.push({ file_id: dataId });
          });

          installer_answers_photos.push({
            question_order_id: data.order,
            data: dataArray
          });
        }
      }
    });

    await apiGet(`files?search={"id":[` + photoIds + `]}`, this.props.token).then(res => {
      if (res.data) {
        installer_answers_photos.map(questions => {
          questions.data.map((photo, index) => {
            res.data.filter(e => {
              e.id === photo.file_id ? (questions.data[index] = { url: e.s3_location, file_id: e.id }) : [];
            });
          });
        });
      }
    });
    this.props.activityData.installer_questions_photos = installer_answers_photos;

    if (this.uploadedImagesCount == this.props.photos.length && this.isSignatureUploaded) {
      await apiPatchAnswers(
        `activities/${this.props.activityData.id}`,
        {
          installer_questions_answers: JSON.stringify(this.props.activityData.installer_questions_answers)
        },
        this.props.token
      ).then(response => {
        this.setState({
          isUpdateLoading: false
        });
        this.uploadedImagesCount = 0;
        isSignatureUploaded = false;
        if (response) {
          this.props.addPhoto([]);
          this.props.setSignature([]);
          Alert.alert('Success', 'Your answer(s) have been updated.', [{ text: 'Ok' }]);
        }
      });
    }
  };

  render() {
    if (this.props.isLoading === false) {
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
                  deleteInstallerPhotos={this.deleteInstallerPhotos}
                  setSignature={this.props.setSignature}
                />
                <View style={{ marginTop: 24 }}>
                  <Button
                    textColor={colors.white}
                    textStyle={{ fontSize: 20 }}
                    caption="Update"
                    isLoading={this.state.isUpdateLoading}
                    bgColor={this.state.isUpdateLoading ? '#b1cec1' : colors.blue}
                    onPress={async () => {
                      this.setState({
                        isUpdateLoading: true
                      });
                      if (this.props.photos.length > 0) {
                        this.props.photos.forEach((item, photoIndex) => {
                          apiGet('aws-s3-presigned-urls', this.props.token)
                            .then(res => {
                              RNFetchBlob.fetch(
                                'PUT',
                                res.data.url,
                                {
                                  'security-token': this.props.token,
                                  'Content-Type': 'application/octet-stream'
                                },
                                RNFetchBlob.wrap(item.uri.replace('file://', ''))
                              )
                                .then(() => {
                                  RNFetchBlob.fs.stat(item.uri.replace('file://', '')).then(stats => {
                                    const formData = new FormData();
                                    formData.append('file_type', 'image/jpeg');
                                    formData.append('name', stats.filename);
                                    formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                    formData.append('size', stats.size);
                                    apiPostImage(`files`, formData, this.props.token)
                                      .then(fileRes => {
                                        this.props.activityData.installer_questions_answers.forEach((question, index) => {
                                          if (question.order === item.order) {
                                            if (question.type == 'photo') {
                                              if (
                                                this.props.activityData.installer_questions_answers[index].answers == undefined ||
                                                this.props.activityData.installer_questions_answers[index].answers == ''
                                              ) {
                                                this.props.activityData.installer_questions_answers[index].answers = [fileRes.data.id];
                                              } else {
                                                this.props.activityData.installer_questions_answers[index].answers.push(fileRes.data.id);
                                              }
                                            } else {
                                              if (
                                                this.props.activityData.installer_questions_answers[index].photo == undefined ||
                                                this.props.activityData.installer_questions_answers[index].photo == ''
                                              ) {
                                                this.props.activityData.installer_questions_answers[index].photo = [fileRes.data.id];
                                              } else {
                                                this.props.activityData.installer_questions_answers[index].photo.push(fileRes.data.id);
                                              }
                                            }
                                          }
                                        });
                                        this.uploadedImagesCount += 1;
                                        this.updateInstallerQuestionAnswers();
                                      })
                                      .catch(err => {
                                        this.setState({
                                          isUpdateLoading: false
                                        });
                                      });
                                  });
                                })
                                .catch(err => {
                                  this.setState({
                                    isUpdateLoading: false
                                  });
                                  console.log(err);
                                });
                            })
                            .catch(err => {
                              this.setState({
                                isUpdateLoading: false
                              });
                            });
                        });
                      }
                      if (this.props.signature.length == 1) {
                        let signatureQuestionIndex = this.props.activityData.installer_questions_answers.findIndex(question => question.type == 'signature');
                        let signatureQuestion = this.props.activityData.installer_questions_answers[signatureQuestionIndex];
                        if (signatureQuestionIndex != -1) {
                          apiGet('aws-s3-presigned-urls', this.props.token).then(res => {
                            RNFetchBlob.fetch(
                              'PUT',
                              res.data.url,
                              {
                                'security-token': this.props.token,
                                'Content-Type': 'image/png'
                              },
                              RNFetchBlob.wrap(this.props.signature[0].replace('file://', ''))
                            )
                              .then(() => {
                                RNFetchBlob.fs.stat(this.props.signature[0].replace('file://', '')).then(stats => {
                                  const formData = new FormData();
                                  formData.append('file_type', 'image/jpeg');
                                  formData.append('name', stats.filename);
                                  formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                  formData.append('size', stats.size);
                                  apiPostImage(`files`, formData, this.props.token)
                                    .then(fileRes => {
                                      signatureQuestion.answers = fileRes.data.id;
                                      this.isSignatureUploaded = true;
                                      this.updateInstallerQuestionAnswers();
                                    })
                                    .catch(err => {
                                      this.setState({
                                        isUpdateLoading: false
                                      });
                                    });
                                });
                              })
                              .catch(err => {
                                this.setState({
                                  isUpdateLoading: false
                                });
                                console.log(err);
                              });
                          });
                        }
                      } else {
                        this.isSignatureUploaded = true;
                        this.updateInstallerQuestionAnswers();
                      }
                    }}
                  />
                  <Button
                    style={{ marginTop: 15 }}
                    onPress={async () => {
                      this.setState({
                        isLoading: true
                      });
                      this.state.isSubmitBtnDisabled = true;
                      if (this.props.photos.length > 0) {
                        this.props.photos.forEach((item, photoIndex) => {
                          apiGet('aws-s3-presigned-urls', this.props.token)
                            .then(res => {
                              RNFetchBlob.fetch(
                                'PUT',
                                res.data.url,
                                {
                                  'security-token': this.props.token,
                                  'Content-Type': 'image/jpeg'
                                },
                                RNFetchBlob.wrap(item.uri.replace('file://', ''))
                              )
                                .then(() => {
                                  RNFetchBlob.fs.stat(item.uri.replace('file://', '')).then(stats => {
                                    const formData = new FormData();
                                    formData.append('file_type', 'image/jpeg');
                                    formData.append('name', stats.filename);
                                    formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                    formData.append('size', stats.size);
                                    apiPostImage(`files`, formData, this.props.token)
                                      .then(fileRes => {
                                        this.props.activityData.installer_questions_answers.forEach((question, index) => {
                                          if (question.order === item.order) {
                                            if (question.type == 'photo') {
                                              if (
                                                this.props.activityData.installer_questions_answers[index].answers == undefined ||
                                                this.props.activityData.installer_questions_answers[index].answers == ''
                                              ) {
                                                this.props.activityData.installer_questions_answers[index].answers = [fileRes.data.id];
                                              } else {
                                                this.props.activityData.installer_questions_answers[index].answers.push(fileRes.data.id);
                                              }
                                            } else {
                                              if (
                                                this.props.activityData.installer_questions_answers[index].photo == undefined ||
                                                this.props.activityData.installer_questions_answers[index].photo == ''
                                              ) {
                                                this.props.activityData.installer_questions_answers[index].photo = [fileRes.data.id];
                                              } else {
                                                this.props.activityData.installer_questions_answers[index].photo.push(fileRes.data.id);
                                              }
                                            }
                                          }
                                        });
                                        this.uploadedImagesCount += 1;
                                        this.saveInstallerQuestionAnswers();
                                      })
                                      .catch(err => {
                                        this.setState({
                                          isLoading: false
                                        });
                                      });
                                  });
                                })
                                .catch(err => {
                                  this.setState({
                                    isLoading: false
                                  });
                                  console.log(err);
                                });
                            })
                            .catch(err => {
                              this.setState({
                                isLoading: false
                              });
                            });
                        });
                      }
                      if (this.props.signature.length == 1) {
                        let signatureQuestionIndex = this.props.activityData.installer_questions_answers.findIndex(question => question.type == 'signature');
                        let signatureQuestion = this.props.activityData.installer_questions_answers[signatureQuestionIndex];
                        if (signatureQuestionIndex != -1) {
                          apiGet('aws-s3-presigned-urls', this.props.token).then(res => {
                            RNFetchBlob.fetch(
                              'PUT',
                              res.data.url,
                              {
                                'security-token': this.props.token,
                                'Content-Type': 'image/png'
                              },
                              RNFetchBlob.wrap(this.props.signature[0].replace('file://', ''))
                            )
                              .then(() => {
                                RNFetchBlob.fs.stat(this.props.signature[0].replace('file://', '')).then(stats => {
                                  const formData = new FormData();
                                  formData.append('file_type', 'image/jpeg');
                                  formData.append('name', stats.filename);
                                  formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                  formData.append('size', stats.size);
                                  apiPostImage(`files`, formData, this.props.token)
                                    .then(fileRes => {
                                      signatureQuestion.answers = fileRes.data.id;
                                      this.isSignatureUploaded = true;
                                      this.saveInstallerQuestionAnswers();
                                    })
                                    .catch(err => {
                                      this.setState({
                                        isLoading: false
                                      });
                                    });
                                });
                              })
                              .catch(err => {
                                this.setState({
                                  isLoading: false
                                });
                                console.log(err);
                              });
                          });
                        }
                      } else {
                        this.isSignatureUploaded = true;
                        this.saveInstallerQuestionAnswers();
                      }
                    }}
                    textColor={colors.white}
                    textStyle={{ fontSize: 20 }}
                    caption="Submit"
                    isLoading={this.state.isLoading}
                    bgColor={this.state.isSubmitBtnDisabled ? '#b1cec1' : colors.green}
                    disabled={this.state.isSubmitBtnDisabled}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
