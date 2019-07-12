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
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityStatus,
  ActivityTitle,
  Button,
} from '../../../components';

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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        connectionStatus={props.connectionStatus}
        navigation={props.navigation}
        sideBar
      />
      <ActivityInfoSection
        navigation={props.navigation}
        activityData={props.activityData}
      />
      {
        props.status === 3 && (
          <React.Fragment>
            <ActivityStatus status={props.status} />
            <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
          </React.Fragment>
        )
      }
      <ActivityTitle title="Comments" />
      <ScrollView
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
            >
              <Text style={{ fontSize: 20, color: colors.white }}>
                Add Photo(s)
              </Text>
            </Button>
          </View>
          <View style={{ marginTop: 24 }}>
            <Button
              bgColor={colors.green}
              onPress={() => {
                const { data } = props;
                console.log(data);
                data.push({
                  commentText: props.comment,
                  name: 'Name LastName',
                  date: 'someDate',
                  time: 'someTime',
                  photos: props.photos,
                });
                props.addPhoto([]);
                props.setComment('');
                props.setData(data);
              }}
            >
              <Text style={{ fontSize: 20, color: colors.white }}>
                Submit
              </Text>
            </Button>
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
          {props.data.map(item => (
            <View
              style={{
                width: '100%',
                marginTop: 32,
                padding: 16,
                backgroundColor: 'white',
              }}
            >
              <Text>
                {item.commentText}
              </Text>
              <Text style={{ flexDirection: 'row', marginTop: 8, color: 'blue' }}>
                {item.name} - {item.date} - {item.time}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {item.photos.map(photo => (
                  <Image
                    source={{ uri: photo }}
                    style={{
                      width: 50,
                      height: 50,
                      marginRight: 16,
                      resizeMode: 'cover',
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
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
