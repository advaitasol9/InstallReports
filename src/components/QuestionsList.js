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
import RNFetchBlob from 'rn-fetch-blob';

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
    if (photo.order === order) {
      return (
        <View style={{ position: 'relative' }}
          key={index}
        >
          <TouchableOpacity
            style={styles.delPhoto}
            onPress={async () => {
              await photosCopy.splice(index, 1);
              props.addPhoto(photosCopy);
              props.updateAnswers();
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
                      props.updateAnswers();
                    }
                  });
                },
              },
              {
                text: 'Take a photo',
                onPress: () => {
                  ImagePicker.launchCamera(options, (response) => {
                    const { photos } = props;
                    if (!response.didCancel) {
                      photos.push({
                        uri: response.uri,
                        order,
                      });
                      props.setUpdate(!props.update);
                      props.addPhoto(photos);
                      props.updateAnswers();
                    }
                  });
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
    const answer = new Set(item.answers);
    let data = [];
    Object.keys(item.values).forEach(key => {
      data.push({ "key": key, "value": item.values[key] });
    });
    return (
      <View style={{ width: '100%' }}
        key={item.order}
      >
        <Text>{item.order}. {item.text}</Text>
        {
          data.map((question) => {
            return (
              <CheckBox
                id={question.key}
                key={question.key}
                title={question.value}
                setAnswer={(isChecked) => {
                  if (!isChecked) {
                    answer.add(question.key);
                    item.answers = Array.from(answer);
                  } else {
                    answer.delete(question.key);
                    item.answers = Array.from(answer);
                  }
                  props.updateAnswers();
                }}
                filter={item.answers || []}
                forQuestionList
              />
            )
          })
        }
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && (
          <View style={styles.photoSection}>
            {props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}
          </View>
        )}
        {item.required && <Required />}
      </View>
    );
  };

  const renderFreeform = item => (
    <View style={{ width: '100%' }}
      key={item.order}
    >
      <Text style={{ marginTop: 12, paddingBottom: 12 }}>{item.order}. {item.text}</Text>
      <TextInput
        multiline
        placeholder="Enter the answer"
        value={item.answers}
        onChangeText={(text) => {
          item.answers = text;
          props.updateAnswers();
          return true;
        }}
        style={[styles.inputStyle, { height: 160 }]}
      />
      {item.allow_photos && renderAddPhotoButton(item.order)}
      {item.allow_photos && (
        <View style={styles.photoSection}>
          {props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}
        </View>
      )}
      {item.required && <Required />}
    </View>
  );

  const renderDropdown = (item) => {
    let data = [];
    Object.keys(item.values).forEach(key => {
      data.push({ "key": key, "value": item.values[key] });
    });
    return (
      <View style={{ width: '100%' }}
        key={item.order}
      >
        <Text style={{ marginTop: 12 }}>{item.order}. {item.text}</Text>
        <Dropdown
          label="Сhoose option"
          data={data}
          value={item.answers == undefined ? "" : item.answers}
          onChangeText={(text) => {
            const selectedItem = data.filter(answer => answer.value == text)[0];
            item.answers = selectedItem.key;
            props.updateAnswers();
            return true;
          }}
        />
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && (
          <View style={styles.photoSection}>
            {props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}
          </View>
        )}
        {item.required && <Required />}
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
          console.log('Image path missing and no images in camera roll')
          return;
        }
      } else {
        imageUri = path;
      }
    } catch (e) {
      console.log(e.message)
    }

    props.setSignature([imageUri]);
    props.updateAnswers();
  }

  const renderSignature = (item) => {
    const signature = [];
    return (
      <View style={{ width: '100%' }}
        key={item.order}
      >
        <Text style={{ marginTop: 12, paddingBottom: 12 }}>{item.order}. {item.text}</Text>
        <RNSketchCanvas
          ref={ref => this.canvas = ref}
          containerStyle={[
            {
              height: 200,
              marginTop: 10,
              backgroundColor: colors.white,
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
          onClearPressed={() => {
            props.setSignature([]);
            props.updateAnswers();
          }}
          onSketchSaved={(success, filePath) => {
            onSave(success, filePath);
          }}
          savePreference={() => {
            return {
              folder: 'RNSketchCanvas',
              filename: item.text,
              transparent: false,
              imageType: 'png'
            }
          }}
          onStrokeEnd={(path) => {
            this.canvas.save();
          }}
        />
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && (
          <View style={styles.photoSection}>
            {props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}
          </View>
        )}
        {item.required && <Required />}
      </View>
    );
  };

  const renderPhotoQuestion = (item) => {
    return (
      <View style={{ width: '100%' }}
        key={item.order}
      >
        <Text style={{ marginTop: 12, paddingBottom: 12 }}>{item.order}. {item.text}</Text>
        {renderAddPhotoButton(item.order)}
        {
          <View style={styles.photoSection}>
            {props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}
          </View>
        }
        {item.required && <Required />}
      </View>
    );
  };

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
    marginBottom: 0,
    marginTop: 5,
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
