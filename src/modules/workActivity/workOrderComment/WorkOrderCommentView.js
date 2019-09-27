import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';

import { colors } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityStatus,
  ActivityTitle,
  Button,
} from '../../../components';
import {
  apiGet, apiPostImage, apiPatchImage, apiPostComment, apiGetJson,
} from '../../../core/api';

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};

export default function WorkOrderCommentView(props) {
  const renderPhoto = (photo) => {
    console.log(photo);
    return (
      <Image source={{ uri: photo }} style={styles.photoBlock} />
    );
  };

  if (props.isLoading === true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        connectionStatus={props.connectionStatus}
        navigation={props.navigation}
        sideBar
      />
      <ScrollView style={{ width: '100%' }}>
        <ActivityInfoSection
          navigation={props.navigation}
          activityData={props.activityData}
        />
        <ActivityStatus status={props.activityData.status.replace(/_/g, ' ')} />
        <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
        <ActivityTitle title="Comments" />
        <View
          style={{
            backgroundColor: colors.lightGray,
            paddingVertical: 24,
            width: '100%',
          }}
        >
          <View style={styles.scrollContainer}>
            <TextInput
              multiline
              placeholder="Placeholder..."
              style={[styles.inputStyle, { height: 160 }]}
              onChangeText={text => props.setComment(text)}
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
                          ImagePicker.launchImageLibrary(options, (response) => {
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
                              screen: 'Comment',
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
            <View style={styles.photoSection}>
              { props.photos.map(photo => renderPhoto(photo)) }
            </View>
            <TouchableOpacity
              style={{
                display: props.photos.length === 0 ? 'none' : 'flex',
                alignItems: 'center',
                width: '100%',
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
            <View style={{ marginTop: 24 }}>
              <Button
                bgColor={
                  (props.photos.length === 0 && props.comment === '')
                    ? '#b1cec1'
                    : colors.green
                }
                disabled={props.photos.length === 0 && props.comment === ''}
                onPress={async () => {
                  const data = `text=${props.comment}&user_ids=%5B${props.accountId}%5D&undefined=`;
                  await apiPostComment(`test-app-1/activities/${props.activityId}/comments`, data, props.token).then((resPostText) => {
                    console.log(resPostText);
                    props.photos.forEach((item) => {
                      apiGet('http://142.93.1.107:9002/api/test-app-1/aws-s3-presigned-urls', props.token).then((res) => {
                        console.log('res   ', res);
                        RNFetchBlob.fetch('PUT', res.data.url, {
                          'security-token': props.token,
                          'Content-Type': 'application/octet-stream',
                        }, RNFetchBlob.wrap(item))
                          .then((blobRes) => {
                            console.log(blobRes.text());
                            RNFetchBlob.fs.stat(item.replace('file://', ''))
                              .then((stats) => {
                                const formData = new FormData();
                                formData.append('file_type', 'image/jpeg');
                                formData.append('name', stats.filename);
                                formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                formData.append('size', stats.size);
                                apiPostImage(`http://142.93.1.107:9001/test-app-1/activities/${props.activityId}/comments/${resPostText.data.id}/files`, formData, props.token).then((postRes) => {
                                  console.log('postRes', postRes);
                                  const patchData = new FormData();
                                  patchData.append('logo_file_id', postRes.data.comments[0].logo_file_id);
                                  apiGetJson(`test-app-1/activities/${props.activityId}/comments`, props.token)
                                    .then((response) => {
                                      console.log(response.data);
                                      props.setData(response.data);
                                    });
                                  apiPatchImage(
                                    `http://142.93.1.107:9001/test-app-1/activities/${props.activityId}/comments/${resPostText.data.id}`,
                                    patchData,
                                    props.token,
                                  );
                                });
                              });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      });
                    });
                  });
                  await props.addPhoto([]);
                  await props.setComment('');
                  console.log(props.data);
                }}
                textColor={colors.white}
                textStyle={{ fontSize: 20 }}
                caption="Submit"
              />
            </View>
            {props.data.map(item => (
              <View
                style={{
                  width: '100%',
                  marginTop: 32,
                  padding: 16,
                  backgroundColor: 'white',
                }}
              >
                {item.text !== '' && (
                  <Text>
                    {item.text}
                  </Text>
                )}
                <Text style={{ flexDirection: 'row', marginTop: 8, color: 'blue' }}>
                  {item.created_at}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {item.files.map((photo) => {
                    if (photo.file_type === 'image/jpeg') {
                      return (
                        <Image
                          source={{ uri: photo.s3_location }}
                          style={{
                            width: 50,
                            height: 50,
                            marginRight: 16,
                            resizeMode: 'cover',
                          }}
                        />
                      );
                    }
                    if (photo.file_type === 'pdf') {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('PdfDoc', { uri: photo.s3_location });
                          }}
                        >
                          <Image
                            source={require('../../../../assets/images/pdf.png')}
                            style={{
                              width: 50,
                              height: 50,
                              marginRight: 16,
                              resizeMode: 'cover',
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
    backgroundColor: colors.lightGray,
  },
  scrollContainer: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  inputStyle: {
    fontSize: 14,
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top',
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
