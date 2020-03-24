import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { compose, lifecycle } from 'recompose';
import { Dropdown } from 'react-native-material-dropdown';
import IO from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import { withNavigation } from 'react-navigation';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

import Button from './Button';
import CheckBox from './CheckBox';
import { colors } from '../styles';

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};

const Required = () => (
  <View style={styles.requiredBlock}>
    <Text style={styles.requiredText}>
      required
    </Text>
  </View>
);

const QuestionsList = (props) => {
  const renderPhoto = (photo, index, order) => {
    const photosCopy = props.photos.slice();
    console.log(photosCopy);
    if (photo.order === order) {
      return (
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={styles.delPhoto}
            onPress={() => {
              photosCopy.splice(index, 1);
              console.log(photosCopy);
              props.addPhoto(photosCopy);
            }}
          >
            <View style={styles.whiteBackground} />
            <IO
              style={styles.delIcon}
              name="md-close-circle"
            />
          </TouchableOpacity>
          <Image source={{ uri: photo.uri }} style={styles.photoBlock} />
        </View>
      );
    }
    return null;
  };


  const renderAddPhotoButton = order => (
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
                    if (!response.didCancel) {
                      photos.push({
                        uri: response.uri,
                        order,
                      });
                      props.setUpdate(!props.update);
                      props.addPhoto(photos);
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
                      order,
                      screen: props.screen,
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
  );

  const renderChecklist = (item) => {
    const answer = new Set(item.answer);
    return (
      <View style={{ width: '100%' }}>
        <Text>{item.order}. {item.text}</Text>
        {item.values.map((val, index) => (
          <CheckBox
            id={index}
            title={val}
            setAnswer={(isChecked) => {
              if (!isChecked) {
                answer.add(val);
                item.answer = Array.from(answer);
              } else {
                answer.delete(val);
                item.answer = Array.from(answer);
              }
            }}
            filter={item.answer || []}
            forQuestionList
          />
        ))}
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && (
          <View style={styles.photoSection}>
            { props.photos.map((photo, index) => renderPhoto(photo, index, item.order)) }
          </View>
        )}
        {item.required && <Required />}
      </View>
    );
  };

  const renderFreeform = item => (
    <View style={{ width: '100%' }}>
      <Text style={{ marginTop: 12, paddingBottom: 12 }}>{item.order}. {item.text}</Text>
      <TextInput
        multiline
        placeholder="Enter the answer"
        onChangeText={(text) => {
          item.answer = text;
          return true;
        }}
        style={[styles.inputStyle, { height: 160 }]}
      />
      {item.allow_photos && renderAddPhotoButton(item.order)}
      {item.allow_photos && (
        <View style={styles.photoSection}>
          { props.photos.map((photo, index) => renderPhoto(photo, index, item.order)) }
        </View>
      )}
      {item.required && <Required />}
      {/*
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
                          screen: 'Questions',
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
      */}
    </View>
  );

  const renderDropdown = (item) => {
    const data = item.values.reduce((currentVal, value) => [...currentVal, { value }], []);
    return (
      <View style={{ width: '100%' }}>
        <Text style={{ marginTop: 12 }}>{item.order}. {item.text}</Text>
        <Dropdown
          label="Сhoose option"
          data={data}
          onChangeText={(text) => {
            item.answer = text;
            return true;
          }}
        />
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && (
          <View style={styles.photoSection}>
            { props.photos.map((photo, index) => renderPhoto(photo, index, item.order)) }
          </View>
        )}
        {item.required && <Required />}
      </View>
    );
  };

  const renderSignature = (item) => {
    const signature = [];
    return (
      <View style={{ width: '100%' }}>
        <Text style={{ marginTop: 12, paddingBottom: 12 }}>{item.order}. {item.text}</Text>
        <RNSketchCanvas
          containerStyle={[styles.inputStyle, styles.sketchContainer]}
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
          onClearPressed={() => {
            item.answer = [];
          }}
          onStrokeEnd={(path) => {
            signature.push(path.path.data);
            item.answer = signature;
          }}
        />
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && (
          <View style={styles.photoSection}>
            { props.photos.map((photo, index) => renderPhoto(photo, index, item.order)) }
          </View>
        )}
        {item.required && <Required />}
      </View>
    );
  };

  const renderPhotoQuestion = item => (
    <View style={{ width: '100%' }}>
      <Text style={{ marginTop: 12, paddingBottom: 12 }}>{item.order}. {item.text}</Text>
      {renderAddPhotoButton(item.order)}
      {item.allow_photos && (
        <View style={styles.photoSection}>
          { props.photos.map((photo, index) => renderPhoto(photo, index, item.order)) }
        </View>
      )}
      {item.required && <Required />}
    </View>
  );

  return (
    <View>
      {
        props.questions && props.questions.map((item) => {
          if (item.type === 'checklist') {
            return renderChecklist(item);
          }
          if (item.type === 'freeform') {
            return renderFreeform(item);
          }
          if (item.type === 'dropdown') {
            return renderDropdown(item);
          }
          if (item.type === 'signature') {
            return renderSignature(item);
          }
          if (item.type === 'photo') {
            return renderPhotoQuestion(item);
          }
          return true;
        })
      }
    </View>
  );
};

export default compose(
  withNavigation,
  lifecycle({
    componentWillMount() {
    },
  }),
)(QuestionsList);

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top',
  },
  sketchContainer: {
    height: 200,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  functionButton: {
    margin: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
});
