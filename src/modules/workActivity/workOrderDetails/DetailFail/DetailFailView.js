// @flow
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, StatusBar, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/Ionicons';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import RNFetchBlob from 'rn-fetch-blob';

import { colors } from '../../../../styles';
import { Button, FailedModal, Header } from '../../../../components';
import { BackHandler } from 'react-native';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
    path: 'Install Reports'
  }
};

export default class DetailFailedView extends Component {
  constructor(props) {
    super(props);
    this.props.setModalVisible(false);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  handleBackButtonClick = () => {
    this.props.addPhoto([]);
    this.props.navigation.navigate('DetailsMain');
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  render() {
    const Required = () => (
      <View style={styles.requiredBlock}>
        <Text style={styles.requiredText}>required</Text>
      </View>
    );

    const renderPhoto = (photo, index) => {
      const photosCopy = this.props.photos.slice();
      return (
        <View style={{ position: 'relative' }} key={index}>
          <TouchableOpacity
            style={styles.delPhoto}
            onPress={async () => {
              await photosCopy.splice(index, 1);
              this.props.addPhoto(photosCopy);
            }}
          >
            <View style={styles.whiteBackground} />
            <IO style={styles.delIcon} name="md-close-circle" />
          </TouchableOpacity>
          <Image source={{ uri: photo }} style={styles.photoBlock} />
        </View>
      );
    };

    const onSave = async (success, path) => {
      if (!success) return;
      let imageUri;

      try {
        if (path == null) {
          const images = await CameraRoll.getPhotos({ first: 1 });
          if (images.length > 0) {
            imageUri = [0].image.uri;
          } else {
            console.log('Image path missing and no images in camera roll');
            return;
          }
        } else {
          imageUri = path;
        }
      } catch (e) {
        console.log(e.message);
      }

      this.props.setSignature([imageUri]);
    };

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} />
        <Header connectionStatus={this.props.connectionStatus} changesNum={this.props.changes.length} navigation={this.props.navigation} sideBar indicator />
        <View style={styles.partialInstallationsHeader}>
          <Text style={styles.partialInstallations}>Failed Attempt</Text>
        </View>
        <ScrollView>
          <View style={styles.scrollContainer}>
            <Text style={{ fontSize: 16, marginTop: 16 }}>Please explain why the installation cannot be completed. Take photos to document the situation.</Text>
            <TextInput
              multiline
              placeholder="Reason for failed installation"
              style={[styles.inputStyle, { height: 160 }]}
              onChangeText={text => {
                const regex = /(<([^>]+)>)/gi;
                const result = text.replace(regex, '');
                this.props.setComment(result);
              }}
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
                          ImagePicker.launchImageLibrary(options, response => {
                            const { photos } = this.props;
                            if (!response.didCancel) {
                              photos.push(response.uri);
                              this.props.addPhoto(photos);
                              this.props.setNumOfChanges(this.props.numOfChanges);
                            }
                          });
                        }
                      },
                      {
                        text: 'Take a photo',
                        onPress: () => {
                          ImagePicker.launchCamera(options, response => {
                            const { photos } = this.props;
                            if (!response.didCancel) {
                              photos.push(response.uri);
                              this.props.addPhoto(photos);
                              this.props.setNumOfChanges(this.props.numOfChanges);
                            }
                          });
                        }
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      }
                    ],
                    { cancelable: true }
                  );
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Add Photo(s)"
              />
            </View>
            <Required />
            <View style={styles.photoSection}>{this.props.photos.map((photo, index) => renderPhoto(photo, index))}</View>
            <Text style={{ fontSize: 16, marginTop: 16 }}>Manager on Duty Signature:</Text>
            <RNSketchCanvas
              ref={ref => (this.canvas = ref)}
              containerStyle={[
                {
                  height: 200,
                  marginTop: 10,
                  backgroundColor: colors.white
                }
              ]}
              canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              strokeColor={colors.primary}
              clearComponent={
                <View style={styles.functionButton}>
                  <Text style={{ color: colors.primary }}>Clear</Text>
                </View>
              }
              onSketchSaved={(success, filePath) => {
                onSave(success, filePath);
              }}
              savePreference={() => {
                return {
                  folder: 'RNSketchCanvas',
                  filename: 'fail_sign',
                  transparent: false,
                  imageType: 'png'
                };
              }}
              onStrokeEnd={path => {
                this.canvas.save();
              }}
            />
            <TextInput placeholder="Enter name..." style={styles.inputStyle} onChangeText={text => this.props.setName(text)} value={this.props.name} />
            <View style={styles.buttonRow}>
              <Button
                bgColor={this.props.photos.length === 0 || this.props.comment === '' ? '#b1cec1' : colors.green}
                disabled={this.props.photos.length === 0 || this.props.comment === ''}
                style={{ width: '48%' }}
                onPress={async () => {
                  this.props.setModalVisible(true);
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
                  this.props.setSignature([]);
                  this.props.navigation.navigate('DetailsMain');
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Cancel"
              />
            </View>
          </View>
        </ScrollView>
        <FailedModal mainProps={this.props} />
      </View>
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
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32
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
  requiredBlock: {
    width: '100%',
    alignItems: 'flex-end'
  },
  requiredText: {
    fontSize: 12,
    marginTop: 8,
    color: colors.darkGray
  },
  photoSection: {
    marginTop: 12
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  partialInstallations: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 12
  },
  partialInstallationsHeader: {
    width: '100%',
    backgroundColor: colors.blue,
    alignItems: 'flex-start',
    paddingHorizontal: 24
  },
  modalContainer: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.black,
    opacity: 0.5,
    zIndex: 100
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  delPhoto: {
    position: 'absolute',
    top: 28,
    right: 16,
    zIndex: 10,
    alignItems: 'center'
  },
  delIcon: {
    color: colors.red,
    fontSize: 48
  },
  whiteBackground: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 10,
    borderRadius: 16,
    backgroundColor: 'white'
  },
  functionButton: {
    margin: 16,
    marginBottom: 0,
    marginTop: 5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});
