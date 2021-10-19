import moment from 'moment';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/FontAwesome';
import { ActivityInfoSection, ActivityStatus, ActivityTitle, Button, Header } from '../../../components';
import CommentImageView from '../../../components/CommentImageView';
import { colors } from '../../../styles';
import CameraRoll from '@react-native-community/cameraroll';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const options = {
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'Install Reports'
  }
};

export default function WorkOrderCommentView(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const renderPhoto = (photo, index) => {
    const photosCopy = props.photos.slice();
    return (
      <View style={{ position: 'relative' }} key={index}>
        <TouchableOpacity
          style={styles.delPhoto}
          onPress={async () => {
            await photosCopy.splice(index, 1);
            props.addPhoto(photosCopy);
          }}
        >
          {/* <View style={styles.whiteBackground} /> */}
          <IO name="times-circle" color={colors.red} size={40} />
        </TouchableOpacity>
        <Image source={{ uri: photo }} style={styles.photoBlock} />
      </View>
    );
  };

  if (props.isLoading === true) {
    return (
      <View style={styles.backgroundActivity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (props.imageModal) {
    return (
      <CommentImageView
        imageURL={props.imageURL}
        callback={() => {
          setIsImageViewVisible(true);
          props.setImageModal(!props.imageModal);
        }}
      ></CommentImageView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header connectionStatus={props.connectionStatus} navigation={props.navigation} sideBar />
      <ScrollView style={{ width: '100%' }}>
        <ActivityInfoSection navigation={props.navigation} activityData={props.activityData} />
        <ActivityStatus status={props.activityData.status} />
        <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
        <ActivityTitle title="Messages" />
        <View
          style={{
            backgroundColor: colors.lightGray,
            paddingVertical: 24,
            width: '100%'
          }}
        >
          <View style={styles.scrollContainer}>
            <TextInput
              multiline
              placeholder="Add Comment..."
              style={[styles.inputStyle, { height: 160 }]}
              onChangeText={text => {
                const regex = /(<([^>]+)>)/gi;
                const result = text?.replace(regex, '');
                props.setComment(result);
              }}
              value={props.comment}
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
                          ImagePicker.launchImageLibrary(options, response => {
                            const { photos } = props;
                            if (!response.didCancel) {
                              photos.push(response.uri);
                              props.addPhoto(photos);
                              props.setNumOfChanges(props.numOfChanges);
                            }
                          });
                        }
                      },
                      {
                        text: 'Take a photo',
                        onPress: () => {
                          ImagePicker.launchCamera(options, response => {
                            const { photos } = props;
                            if (!response.didCancel) {
                              photos.push(response.uri);
                              props.addPhoto(photos);

                              //save to cameraRoll
                              let permission = false;
                              if (Platform.OS == 'android') {
                                permission = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                              }

                              if (Platform.OS !== 'android' || permission) {
                                try {
                                  CameraRoll.save(response.uri, { album: 'Install Reports' })
                                    .then(() => {
                                      console.log('photo saved to album');
                                    })
                                    .catch(e => {
                                      console.log(e);
                                    });
                                } catch (e) {
                                  console.log(e);
                                }
                              }

                              props.setNumOfChanges(props.numOfChanges);
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
            <View style={styles.photoSection}>{props.photos.map((photo, index) => renderPhoto(photo, index))}</View>
            <View style={{ marginTop: 24 }}>
              <Button
                bgColor={props.photos.length === 0 && props.comment === '' ? '#b1cec1' : colors.green}
                disabled={props.photos.length === 0 && props.comment === ''}
                onPress={async () => {
                  await setIsLoading(true);
                  await props.onSubmit();
                  await setIsLoading(false);
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Submit"
                isLoading={isLoading}
              />
            </View>
            {props.isCommentLoading && (
              <View
                style={{
                  paddingVertical: 20
                }}
              >
                <ActivityIndicator animating size="small" />
              </View>
            )}

            {props.data.map((item, i) => (
              <View
                key={i}
                style={{
                  width: '100%',
                  marginTop: 32,
                  padding: 16,
                  backgroundColor: 'white'
                }}
              >
                {item.text !== '' && <Text>{item.text}</Text>}
                <Text style={{ flexDirection: 'row', marginTop: 8, color: 'blue' }}>{item.users[0].first_name + ' ' + item.users[0].last_name}</Text>
                <Text style={{ flexDirection: 'row', marginTop: 8, color: 'blue' }}>{moment(item.created_at).format('M/D/YY - hh:mmA')}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {item.files.map((photo, j) => {
                    //console.log(photo);
                    if (photo.file_type === 'image/jpeg' || photo.file_type === 'image/png') {
                      return (
                        <TouchableOpacity
                          key={j}
                          onPress={() => {
                            props.setImageURL(photo.s3_location);
                            setIsImageViewVisible(true);
                            props.setImageModal(!props.imageModal);
                          }}
                        >
                          <Image
                            key={j}
                            source={{ uri: photo.s3_location }}
                            style={{
                              width: 50,
                              height: 50,
                              marginRight: 16,
                              resizeMode: 'cover'
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }
                    if (photo.file_type === 'pdf' || photo.file_type === 'application/pdf') {
                      return (
                        <TouchableOpacity
                          key={j}
                          onPress={() => {
                            props.navigation.navigate('PdfDoc', { uri: photo.s3_location, name: photo.name, type: photo.file_type, route: 'comment' });
                          }}
                        >
                          <Image
                            key={j}
                            source={require('../../../../assets/images/pdf.png')}
                            style={{
                              width: 50,
                              height: 50,
                              marginRight: 16,
                              resizeMode: 'cover'
                            }}
                          />
                          <Text>{photo.name}</Text>
                        </TouchableOpacity>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray
  },
  scrollContainer: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 48
  },
  inputStyle: {
    fontSize: 14,
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top'
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
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
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
