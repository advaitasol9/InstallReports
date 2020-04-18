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
  StatusBar,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';

import { colors } from '../../../../styles';
import { Button, FailedModal, Header } from '../../../../components';
import {
  apiChangeStatus, apiGet, apiPostImage, apiPostComment,
} from '../../../../core/api';
import setChangesInOffline from '../../../../core/setChanges';

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

export default class DetailFailedView extends Component {

  constructor(props) {
    super(props);
    uploadedImagesCount = 0;
    this.props.setModalVisible(false);
  }

  isLastImageUploaded() {
    if (this.uploadedImagesCount == this.props.photos.length) {
      this.props.addPhoto([]);
      this.props.navigation.navigate('Work Order');
    }
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
        <View style={{ position: 'relative' }}>
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
          <Text style={styles.partialInstallations}>Failed Installation</Text>
        </View>
        <ScrollView>
          <View style={styles.scrollContainer}>
            <Text style={{ fontSize: 16 }}>
              A failed installation occurs when an installation will never be completed due
              to circumstances like a closed or incorrect location.
          </Text>
            <Text style={{ fontSize: 16, marginTop: 16 }}>
              Please explain why the installation cannot be comleted.
              Take photos to document the situation.
          </Text>
            <TextInput
              multiline
              placeholder="Reason for failed installation"
              style={[styles.inputStyle, { height: 160 }]}
              onChangeText={text => this.props.setComment(text)}
              value={this.props.comment}
            />
            <Required />
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
                            if (!response.didCancel) {
                              photos.push(response.uri);
                              this.props.addPhoto(photos);
                              this.props.setNumOfChanges(this.props.numOfChanges);
                            }
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
                              screen: 'DetailsFail',
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
                bgColor={
                  (this.props.photos.length === 0 || this.props.comment === '')
                    ? '#b1cec1'
                    : colors.green
                }
                disabled={this.props.photos.length === 0 || this.props.comment === ''}
                style={{ width: '48%' }}
                onPress={async () => {
                  if (!this.props.connectionStatus) {
                    setChangesInOffline(
                      this.props.changes,
                      this.props.setChanges,
                      this.props.setNumOfChanges,
                      this.props.comment,
                      this.props.activityId,
                      this.props.accountId,
                      this.props.photos,
                      'Failed',
                    );
                    this.props.setModalVisible(true);
                  } else {
                    await apiChangeStatus('Failed', this.props.activityId, this.props.token)
                      .then((response) => {
                        const data = `text=${this.props.comment}&user_id=${this.props.accountId}`;
                        apiPostComment(`test-app-1/activities/${this.props.activityId}/comments`, data, this.props.token).then((resPostText) => {
                          if (this.props.photos.length > 0) {
                            this.props.photos.forEach((item, index) => {
                              apiGet('http://142.93.1.107:9002/api/test-app-1/aws-s3-presigned-urls', this.props.token).then((res) => {
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
                                          `http://142.93.1.107:9001/test-app-1/activities/${this.props.activityId}/comments/${resPostText.data.id}/files`,
                                          formData, this.props.token,
                                        );
                                        this.uploadedImagesCount = index + 1;
                                        this.isLastImageUploaded();
                                      });
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              });
                            });
                          }
                        });
                      });
                  }
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Submit"
              />
              <Button
                bgColor={colors.red}
                style={{ width: '48%' }}
                onPress={() => {
                  this.props.addPhoto([]);
                  this.props.navigation.navigate('DetailsMain', { photo: this.props.photos });
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Cancel"
              />
            </View>
          </View>
        </ScrollView>
        <FailedModal />
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
