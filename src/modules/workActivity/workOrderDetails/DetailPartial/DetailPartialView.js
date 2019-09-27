// @flow
import React from 'react';
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
  apiChangeStatus, apiGet, apiPut, apiPostImage, apiPatchImage, apiPostComment,
} from '../../../../core/api';
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
  const Required = () => (
    <View style={styles.requiredBlock}>
      <Text style={styles.requiredText}>
        required
      </Text>
    </View>
  );

  const renderPhoto = (photo) => {
    console.log(photo);
    return (
      <Image source={{ uri: photo }} style={styles.photoBlock} />
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
                          photos.push(response.uri);
                          props.addPhoto(photos);
                          props.setChangesInOffline(props.changesInOffline);
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
            {
              props.photos.map((photo) => {
                console.log(photo);
                return renderPhoto(photo);
              })
            }
          </View>
          <TouchableOpacity
            style={{
              display: props.photos.length === 0 ? 'none' : 'flex',
              alignSelf: 'center',
            }}
            onPress={() => {
              props.addPhoto([]);
            }}
          >
            <IO
              style={{
                color: colors.red,
                fontSize: 48,
                marginTop: 16,
              }}
              name="md-close-circle"
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, marginTop: 16 }}>
            Manager on Duty Signeture:
          </Text>
          <RNSketchCanvas
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
              const { signature } = props;
              signature.push(path.path.data);
              props.setSignature(signature);
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
                await apiChangeStatus('Partial', props.activityId, props.token)
                  .then((response) => {
                    const res = response.json();
                    console.log(response, res);
                    props.setModalVisible(true);
                  });
                const data = `text=${props.commentText}&user_ids=%5B${props.accountId}%5D&undefined=`;
                apiPostComment(`test-app-1/activities/${props.activityId}/comments`, data, props.token).then((resPostText) => {
                  console.log(resPostText);
                  apiGet('http://142.93.1.107:9002/api/test-app-1/aws-s3-presigned-urls', props.token).then((res) => {
                    console.log('res   ', res);
                    apiPut(res.data.url, props.token, props.photos[0]).then((putRes) => {
                      console.log('putRes', putRes);
                      RNFetchBlob.fs.stat(props.photos[0].replace('file://', ''))
                        .then((stats) => {
                          const formData = new FormData();
                          formData.append('file_type', 'image/jpeg');
                          formData.append('name', stats.filename);
                          formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                          formData.append('size', stats.size);
                          apiPostImage(`http://142.93.1.107:9001/test-app-1/activities/${props.activityId}/comments/${resPostText.data.id}/files`, formData, props.token).then((postRes) => {
                            console.log('postRes', postRes);
                            const patchData = `logo_file_id=${postRes.data.activities[0].logo_file_id}`;
                            patchData.append('logo_file_id', postRes.data.activities[0].logo_file_id);
                            apiPatchImage(`http://142.93.1.107:9001/test-app-1/activities/${props.activityId}/comments/${resPostText.data.id}`, patchData, props.token).then((patchRes) => {
                              console.log('patchRes', patchRes);
                            });
                          });
                        });
                    });
                  });
                });
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
      <PartialModal
        commentText={props.comment}
        navigation={props.navigation}
      />
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
});
