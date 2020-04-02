// @flow
import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/Ionicons';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import RNFetchBlob from 'rn-fetch-blob';

import {
  apiChangeStatus, apiGet, apiPostImage, apiPostComment,
} from '../../../../core/api';
import setChangesInOffline from '../../../../core/setChanges';
import { colors } from '../../../../styles';
import { Button, PartialModal, Header } from '../../../../components';

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


export default function DetailPartialView(props) {
  let canvasRef = useRef(null);
  useEffect(() => {
    console.log(props.pathes);
    if (props.pathes) {
      props.pathes.map((item, index) => {
        canvasRef.addPath(item);
      });
    }
  }, []);

  const Required = () => (
    <View style={styles.requiredBlock}>
      <Text style={styles.requiredText}>
        required
      </Text>
    </View>
  );

  const renderPhoto = (photo, index) => {
    const photosCopy = props.photos.slice();
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={styles.delPhoto}
          onPress={async () => {
            await photosCopy.splice(index, 1);
            props.addPhoto(photosCopy);
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
        connectionStatus={props.connectionStatus}
        changesNum={props.changes.length}
        navigation={props.navigation}
        sideBar
        indicator
      />
      <View style={styles.partialInstallationsHeader}>
        <Text style={styles.partialInstallations}>Partial Installation</Text>
      </View>
      <ScrollView>
        <View style={styles.scrollContainer}>
          <Text style={{ fontSize: 16 }}>
            A partial installation occurs when an installation cannot be comleted
            due to circumstances outside of your control.
          </Text>
          <Text style={{ fontSize: 16, marginTop: 16 }}>
            Please explain why the installationcannot be comleted. Take photos to document the
            situation, including any incorrect or damaged materials.
          </Text>
          <TextInput
            multiline
            placeholder="Placeholder..."
            style={[styles.inputStyle, { height: 160 }]}
            onChangeText={text => props.setComment(text)}
            value={props.comment}
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
                          console.log(response);
                          const { photos } = props;
                          if (!response.didCancel) {
                            photos.push(response.uri);
                            props.addPhoto(photos);
                            props.setNumOfChanges(props.numOfChanges);
                          }
                        });
                      },
                    },
                    {
                      text: 'Take a photo',
                      onPress: () => {
                        props.navigation.navigate(
                          'Camera',
                          {
                            photos: props.photos,
                            addPhoto: arr => props.addPhoto(arr),
                            screen: 'DetailsPartial',
                            screenData: {
                              text: props.comment,
                              name: props.name,
                              signature: props.pathes,
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
            { props.photos.map((photo, index) => renderPhoto(photo, index)) }
          </View>
          <Text style={{ fontSize: 16, marginTop: 16 }}>
            Manager on Duty Signeture:
          </Text>
          <RNSketchCanvas
            ref={(c) => { canvasRef = c; }}
            containerStyle={[
              styles.inputStyle,
              {
                height: 200,
                paddingHorizontal: 0,
                paddingVertical: 0,
              },
            ]}
            canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}
            strokeColor={colors.primary}
            clearComponent={(
              <View style={styles.functionButton}>
                <Text style={{ color: colors.primary }}>
                  Clear
                </Text>
              </View>
            )}
            onStrokeEnd={(path) => {
              console.log(props);
              const { signature, pathes } = props;
              signature.push(path.path.data);
              pathes.push(path);
              props.setSignature(signature);
              props.setPathes(pathes);
            }}
          />
          <Required />
          <TextInput
            placeholder="Enter name..."
            style={styles.inputStyle}
            onChangeText={text => props.setName(text)}
            value={props.name}
          />
          <Required />
          <View style={styles.buttonRow}>
            <Button
              bgColor={
                (props.photos.length === 0 || props.name === '' || props.signature === '' || props.comment === '')
                  ? '#b1cec1'
                  : colors.green
              }
              disabled={props.photos.length === 0 || props.name === '' || props.signature === '' || props.comment === ''}
              style={{ width: '45%' }}
              onPress={async () => {
                if (!props.connectionStatus) {
                  setChangesInOffline(
                    props.changes,
                    props.setChanges,
                    props.setNumOfChanges,
                    props.comment,
                    props.activityId,
                    props.accountId,
                    props.photos,
                    'Partial',
                  );
                  props.setModalVisible(true);
                } else {
                  await apiChangeStatus('Failed', props.activityId, props.token)
                    .then((response) => {
                      const res = response.json();
                      console.log(response, res);
                      props.setModalVisible(true);
                    });
                  const data = `text=${props.comment}&user_ids=%5B${props.accountId}%5D&undefined=`;
                  apiPostComment(`test-app-1/activities/${props.activityId}/comments`, data, props.token).then((resPostText) => {
                    if (props.photos.length > 0) {
                      props.photos.forEach((item) => {
                        apiGet('http://142.93.1.107:9002/api/test-app-1/aws-s3-presigned-urls', props.token).then((res) => {
                          RNFetchBlob.fetch('PUT', res.data.url, {
                            'security-token': props.token,
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
                                    `http://142.93.1.107:9001/test-app-1/activities/${props.activityId}/comments/${resPostText.data.id}/files`,
                                    formData, props.token,
                                  );
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        });
                      });
                    }
                  });
                }
              }}
              textColor={colors.white}
              textStyle={{ fontSize: 20 }}
              caption="Submit"
            />
            <Button
              bgColor={colors.red}
              style={{ width: '45%' }}
              onPress={() => {
                props.addPhoto([]);
                props.navigation.navigate('DetailsMain');
              }}
              textColor={colors.white}
              textStyle={{ fontSize: 20 }}
              caption="Cancel"
            />
          </View>
        </View>
      </ScrollView>
      <PartialModal />
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
  functionButton: {
    margin: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
