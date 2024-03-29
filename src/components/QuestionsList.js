import React, { createRef } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Dropdown } from 'react-native-material-dropdown';
import IO from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';
import { compose, lifecycle, withState } from 'recompose';
import { colors } from '../styles';
import Button from './Button';
import CheckBox from './CheckBox';
import CameraRoll from '@react-native-community/cameraroll';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import { TouchableHighlight } from 'react-native-gesture-handler';
const sign = createRef();
const options = {
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const Required = () => (
  <View style={styles.requiredBlock}>
    <Text style={styles.requiredText}>required</Text>
  </View>
);

const QuestionsList = props => {
  const renderPhoto = (photo, index, order) => {
    const photosCopy = props.photos.slice();
    if (photo.order === order) {
      return (
        <View style={{ position: 'relative' }} key={index}>
          <TouchableOpacity
            style={styles.delPhoto}
            onPress={async () => {
              await photosCopy.splice(index, 1);
              props.addPhoto(photosCopy);
              props.updateAnswers();
            }}
          >
            <View style={styles.whiteBackground} />
            <IO name="times-circle" color={colors.red} size={40} />
          </TouchableOpacity>
          <Image source={{ uri: photo.uri }} style={styles.photoBlock} />
        </View>
      );
    }
    return null;
  };

  const renderInstallerPhotos = (photo, index, order) => {
    return (
      <View style={{ position: 'relative' }} key={photo.file_id}>
        <TouchableOpacity
          style={styles.delPhoto}
          onPress={async () => {
            props.deleteInstallerPhotos(photo);
            props.updateAnswers();
          }}
        >
          <View style={styles.whiteBackground} />
          <IO name="times-circle" color={colors.red} size={40} />
        </TouchableOpacity>
        <Image source={{ uri: photo.url }} style={styles.photoBlock} />
      </View>
    );
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
                  ImagePicker.launchImageLibrary(options, response => {
                    const { photos } = props;
                    console.log('launch image library response', response);
                    if (!response.didCancel && !response.error) {
                      photos.push({
                        uri: response.uri,
                        order
                      });
                      props.setUpdate(!props.update);
                      props.addPhoto(photos);
                      props.updateAnswers();
                    }
                  });
                }
              },
              {
                text: 'Take a photo',
                onPress: () => {
                  props.navigation.navigate('Camera', {
                    photos: props.photos,
                    addPhoto: arr => props.addPhoto(arr),
                    screen: props.screen,
                    screenData: {},
                    order,
                    update: props.update,
                    setUpdate: props.setUpdate,
                    updateAnswers: props.updateAnswers
                  });
                  // ImagePicker.launchCamera(options, response => {
                  //   const { photos } = props;
                  //   if (!response.didCancel) {
                  //     photos.push({
                  //       uri: response.uri,
                  //       order
                  //     });
                  //     props.setUpdate(!props.update);
                  //     props.addPhoto(photos);
                  //     //save to cameraRoll
                  //     let permission = false;
                  //     if (Platform.OS == 'android') {
                  //       permission = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                  //     }
                  //     if (Platform.OS !== 'android' || permission) {
                  //       // CameraRoll.save(response.uri, { album: 'Install Reports' })
                  //       //   .then(() => {
                  //       //     console.log('photo saved to album');
                  //       //   })
                  //       //   .catch(e => {
                  //       //     console.log(e);
                  //       //   });
                  //     }
                  //     props.updateAnswers();
                  //   }
                  // });
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
  );

  const renderChecklist = (item, images) => {
    const answer = new Set(item.answers);
    let data = [];
    Object.keys(item.values).forEach(key => {
      data.push({ key: key, value: item.values[key] });
    });
    return (
      <View style={({ width: '100%' }, this.zebraStyle(item.order))} key={item.order}>
        <Text>
          {item.order}. {item.text}
        </Text>
        {data.map(question => {
          return (
            <CheckBox
              id={question.key}
              key={question.key}
              title={question.value}
              setAnswer={isChecked => {
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
          );
        })}
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && <View style={styles.photoSection}>{props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}</View>}
        {<View style={styles.photoSection}>{images.map((data, index) => renderInstallerPhotos(data, index, item.order))}</View>}
        {item.required && <Required />}
      </View>
    );
  };

  const renderFreeform = (item, images) => (
    <View style={({ width: '100%' }, this.zebraStyle(item.order))} key={item.order}>
      <Text style={{ marginTop: 12, paddingBottom: 12 }}>
        {item.order}. {item.text}
      </Text>
      <TextInput
        multiline
        placeholder="Enter the answer"
        value={item.answers}
        onChangeText={text => {
          item.answers = text;
          props.updateAnswers();
          return true;
        }}
        style={[styles.inputStyle, { height: 160 }]}
      />
      {item.allow_photos && renderAddPhotoButton(item.order)}
      {item.allow_photos && <View style={styles.photoSection}>{props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}</View>}
      {<View style={styles.photoSection}>{images.map((data, index) => renderInstallerPhotos(data, index, item.order))}</View>}
      {item.required && <Required />}
    </View>
  );

  const renderDropdown = (item, images) => {
    let data = [];
    Object.keys(item.values).forEach(key => {
      data.push({ key: key, value: item.values[key] });
    });
    return (
      <View style={({ width: '100%' }, this.zebraStyle(item.order))} key={item.order}>
        <Text style={{ marginTop: 12 }}>
          {item.order}. {item.text}
        </Text>
        <Dropdown
          label="Сhoose option"
          data={data}
          value={item.answers == undefined ? '' : item.values[item.answers]}
          onChangeText={text => {
            const selectedItem = data.filter(answer => answer.value == text)[0];
            item.answers = selectedItem.key;
            props.updateAnswers();
            return true;
          }}
        />
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && <View style={styles.photoSection}>{props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}</View>}
        {<View style={styles.photoSection}>{images.map((data, index) => renderInstallerPhotos(data, index, item.order))}</View>}
        {item.required && <Required />}
      </View>
    );
  };

  _onSaveEvent = async result => {
    console.log(result);
    try {
      if (result.pathName == null) {
        const images = await CameraRoll.getPhotos({ first: 1 });
        if (images.length > 0) {
          imageUri = [0].image.uri;
        } else {
          console.log('Image path missing and no images in camera roll');
          return;
        }
      } else {
        imageUri = result.pathName;
      }
      props.setIsSignatureSaved(true);
      props.setSignature([imageUri], props.updateAnswers);
    } catch (e) {
      console.log('error while saving sign', e.message);
    }
    // setTimeout(() => {
    //   props.setSignature([imageUri], props.updateAnswers);
    // }, 1000);
  };

  _onDragEvent = async () => {
    props.setSignature([], props.updateAnswers);
    console.log('dragged');
    props.setIsSignatureSaved(false);
  };

  const resetImage = () => {
    props.setSignature([], props.updateAnswers);
    sign.current.resetImage();
    console.log('resetted');
    props.setIsSignatureSaved(false);
  };

  const renderSignature = (item, images) => {
    const signature = [];
    return (
      <View style={({ width: '100%' }, this.zebraStyle(item.order))} key={item.order}>
        <Text style={{ marginTop: 12, paddingBottom: 12 }}>
          {item.order}. {item.text}
        </Text>
        <View style={[styles.row, { marginBottom: 5 }]}>
          <Button
            style={{ marginRight: 15, width: 90 }}
            onPress={() => {
              sign.current.saveImage();
            }}
            textColor={colors.white}
            textStyle={{ fontSize: 20 }}
            caption={props.isSignatureSaved ? 'Saved' : 'Save'}
            bgColor={props.isSignatureSaved ? '#b1cec1' : colors.green}
            disabled={props.isSignatureSaved}
          />
          <Button
            style={{ width: 90 }}
            onPress={() => {
              resetImage();
            }}
            textColor={colors.white}
            textStyle={{ fontSize: 20 }}
            caption="Reset"
            bgColor={colors.green}
          />
        </View>

        {/* {!props.isSignatureSaved && <Text style={{ color: 'red' }}>The following changes are unsaved.</Text>} */}
        <SignatureCapture
          style={[{ flex: 1 }, styles.signature]}
          ref={sign}
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={true}
          showNativeButtons={false}
          showTitleLabel={false}
          strokeColor="#000000"
          minStrokeWidth={4}
          maxStrokeWidth={4}
          viewMode={'portrait'}
        />
        {/* <RNSketchCanvas
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
          onClearPressed={() => {
            props.setSignature([]);
            setTimeout(() => {
              props.updateAnswers();
            }, 1000);
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
            };
          }}
          onStrokeEnd={path => {
            this.canvas.save();
            setTimeout(() => {
              props.updateAnswers();
            }, 500);
          }}
        /> */}
        {item.allow_photos && renderAddPhotoButton(item.order)}
        {item.allow_photos && <View style={styles.photoSection}>{props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}</View>}
        {/* {(
          <View style={styles.photoSection}>
            {images.map((data, index) => renderInstallerPhotos(data, index, item.order))}
          </View>
        )} */}
        {item.required && <Required />}
      </View>
    );
  };

  const renderPhotoQuestion = (item, images) => {
    return (
      <View style={({ width: '100%' }, this.zebraStyle(item.order))} key={item.order}>
        <Text style={{ marginTop: 12, paddingBottom: 12 }}>
          {item.order}. {item.text}
        </Text>
        {renderAddPhotoButton(item.order)}
        {<View style={styles.photoSection}>{props.photos.map((photo, index) => renderPhoto(photo, index, item.order))}</View>}
        {<View style={styles.photoSection}>{images.map((data, index) => renderInstallerPhotos(data, index, item.order))}</View>}
        {item.required && <Required />}
      </View>
    );
  };

  const getImageUrlsByQuestonOrderId = (photo_data, orderId) => {
    const data = photo_data.find(item => item.question_order_id == orderId);
    return data?.data ?? [];
  };

  return (
    <View>
      {props.questions &&
        props.questions.map((item, index) => {
          if (item.type === 'checklist') {
            return renderChecklist(item, getImageUrlsByQuestonOrderId(props.questions_photos, item.order));
          }
          if (item.type === 'freeform') {
            return renderFreeform(item, getImageUrlsByQuestonOrderId(props.questions_photos, item.order));
          }
          if (item.type === 'dropdown') {
            return renderDropdown(item, getImageUrlsByQuestonOrderId(props.questions_photos, item.order));
          }
          if (item.type === 'signature') {
            return renderSignature(item, getImageUrlsByQuestonOrderId(props.questions_photos, item.order));
          }
          if (item.type === 'photo') {
            return renderPhotoQuestion(item, getImageUrlsByQuestonOrderId(props.questions_photos, item.order));
          }
          return true;
        })}
    </View>
  );
};

function isEven(n) {
  return n % 2 == 0;
}

zebraStyle = function(options) {
  return {
    backgroundColor: isEven(options) ? colors.silver : colors.bluish,
    paddingHorizontal: 10,
    paddingVertical: 10
  };
};

export default compose(
  withNavigation,
  withState('isSignatureSaved', 'setIsSignatureSaved', false),
  lifecycle({
    componentWillMount() {}
  })
)(QuestionsList);

const styles = StyleSheet.create({
  signature: {
    height: 200,
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    margin: 10
  },
  inputStyle: {
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top'
  },
  sketchContainer: {
    height: 200,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  functionButton: {
    margin: 16,
    marginBottom: 0,
    marginTop: 5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
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
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
