// @flow
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  StatusBar,
  WebView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import IO from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../../styles';
import { Button, Header } from '../../../../components';
import setChangesInOffline from '../../../../core/setChanges';
import {
  apiChangeStatus, apiGet, apiPostImage, apiPostComment,
} from '../../../../core/api';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};

import { BackHandler } from 'react-native';

export default class DetailPartialView extends Component {
  constructor(props) {
    super(props);
    uploadedImagesCount = 0;
    this.state = {
      isLoading: false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  isLastImageUploaded() {
    if (this.uploadedImagesCount == this.props.photos.length) {
      this.setState({
        isLoading: false
      });
      this.props.addPhoto([]);
      this.props.navigation.navigate('DetailsMain');
    }
  }

  handleBackButtonClick = () => {
    this.props.addPhoto([]);
    this.props.navigation.navigate('DetailsMain');
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  render() {

    const Required = () => (
      <View style={styles.requiredBlock}>
        <Text style={styles.requiredText}>
          required
      </Text>
      </View>
    );

    const renderPhoto = (photo, index) => {
      const photosCopy = this.props.photos.slice();
      return (
        <View style={{ position: 'relative' }}
          key={index}>
          <TouchableOpacity
            style={styles.delPhoto}
            onPress={async () => {
              await photosCopy.splice(index, 1);
              this.props.addPhoto(photosCopy);
            }}
          >
            <View style={styles.whiteBackground} />
            <IO
              style={styles.delIcon}
              name="md-close-circle"
            />
          </TouchableOpacity>
          <Image source={{ uri: photo }} style={styles.photoBlock} />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} />
        <Header
          connectionStatus={this.props.connectionStatus}
          changesNum={this.props.changes.length}
          navigation={this.props.navigation}
          sideBar
          indicator
        />
        <View style={styles.partialInstallationsHeader}>
          <Text style={styles.partialInstallations}>Pre-Install Documentation</Text>
        </View>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.scrollContainer}>
            <Text style={{ fontSize: 16 }}>
              Please take one or more photos to document the area before any work begins.
              These are required and will be uploaded to this work order within the system.
              You may also enter any additional comments in the text field below.
              Please be sure to thoroughly document the condition of all work areas
              before beginning the installation.
              When you are satisfied with the photo(s) and comments,
              press &quot;Submit&quot; to upload.
          </Text>
            <TextInput
              multiline
              placeholder="Pre-Install Comments"
              style={[styles.inputStyle, { height: 160 }]}
              onChangeText={text => this.props.setComment(text)}
              value={this.props.comment}
            />
            <View style={{ marginTop: 24 }}>
              <Button
                bgColor={colors.blue}
                onPress={() => {
                  Alert.alert(
                    'Add photo',
                    '',
                    [
                      {
                        text: 'Choose from gallery',
                        onPress: () => {
                          ImagePicker.launchImageLibrary(options, (response) => {
                            const { photos } = this.props;
                            photos.push(response.uri);
                            this.props.addPhoto(photos);
                            this.props.setNumOfChanges(this.props.numOfChanges);
                          });
                        },
                      },
                      {
                        text: 'Take a photo',
                        onPress: () => {
                          this.props.navigation.navigate(
                            'Camera',
                            {
                              photos: this.props.photos,
                              addPhoto: arr => this.props.addPhoto(arr),
                              screen: 'DetailsPreInstall',
                              screenData: {
                                text: this.props.comment,
                              },
                            },
                          );
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                    ],
                    { cancelable: true },
                  );
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Add Photo(s)"
              />
            </View>
            <Required />
            <View style={styles.photoSection}>
              {this.props.photos.map((photo, index) => renderPhoto(photo, index))}
            </View>
            <View style={styles.buttonRow}>
              <Button
                bgColor={(this.props.photos.length === 0 || this.props.comment === '') ? colors.grey : colors.green}
                style={{ width: '48%' }}
                disabled={this.props.photos.length === 0 || this.props.comment === ''}

                onPress={async () => {
                  this.setState({
                    isLoading: true
                  });
                  const data = `text=PRE INSTALL NOTES - ${this.props.comment}&user_id=${this.props.accountId}`;
                  if (!this.props.connectionStatus) {
                    setChangesInOffline(
                      this.props.changes,
                      this.props.setChanges,
                      this.props.setNumOfChanges,
                      `PRE INSTALL NOTES - ${this.props.comment}`,
                      this.props.activityId,
                      this.props.accountId,
                      this.props.photos,
                      'In_Progress',
                    );
                    this.setState({
                      isLoading: false
                    });
                    this.props.navigation.navigate('DetailsMain');
                  } else {
                    await apiChangeStatus('In_Progress', this.props.activityId, this.props.token).then(() => {
                      apiPostComment(`activities/${this.props.activityId}/comments`, data, this.props.token).then((resPostText) => {
                        this.props.photos.forEach((item, index) => {
                          apiGet('aws-s3-presigned-urls', this.props.token).then((res) => {
                            RNFetchBlob.fetch('PUT', res.data.url, {
                              'security-token': this.props.token,
                              'Content-Type': 'application/octet-stream',
                            }, RNFetchBlob.wrap(item.replace('file://', '')))
                              .then(() => {
                                RNFetchBlob.fs.stat(item.replace('file://', ''))
                                  .then((stats) => {
                                    const formData = new FormData();
                                    formData.append('file_type', 'image/jpeg');
                                    formData.append('name', stats.filename);
                                    formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                    formData.append('size', stats.size);

                                    apiPostImage(
                                      `activities/${this.props.activityId}/comments/${resPostText.data.id}/files`,
                                      formData, this.props.token,
                                    );
                                    this.uploadedImagesCount = index + 1;
                                    this.isLastImageUploaded();
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
                      }).catch(err => {
                        this.setState({
                          isLoading: false
                        });
                      });
                    }).catch(err => {
                      this.setState({
                        isLoading: false
                      });
                    });
                  }
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Submit"
                isLoading={this.state.isLoading}
              />
              <Button
                bgColor={colors.red}
                style={{ width: '48%' }}
                onPress={() => {
                  this.props.addPhoto([]);
                  this.props.navigation.navigate('DetailsMain');
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Cancel"
              />
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
    backgroundColor: colors.lightGray,
  },
  scrollContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  requiredBlock: {
    width: '100%',
    alignItems: 'flex-end',
  },
  requiredText: {
    fontSize: 12,
    marginTop: 8,
    color: colors.darkGray,
  },
  photoSection: {
    marginTop: 12,
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  partialInstallations: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 12,
  },
  partialInstallationsHeader: {
    width: '100%',
    backgroundColor: colors.blue,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  modalContainer: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.black,
    opacity: 0.5,
    zIndex: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  delPhoto: {
    position: 'absolute',
    top: 28,
    right: 16,
    zIndex: 10,
    alignItems: 'center',
  },
  delIcon: {
    color: colors.red,
    fontSize: 48,
  },
  whiteBackground: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 10,
    borderRadius: 16,
    backgroundColor: 'white',
  },
});
