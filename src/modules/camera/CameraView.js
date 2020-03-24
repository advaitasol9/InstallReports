import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  StatusBar,
  CameraRoll,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

const { width, height } = Dimensions.get('window');
let factor;

if (width > 512) {
  factor = 1.7;
} else {
  factor = 1;
}

let myRef;

export function Camera(props) {
  const flashIcon = () => {
    let icon;

    if (props.cameraFlashMode === 0) {
      icon = require('../../../assets/images/camera/ic_flash_auto_white.png');
    } else if (props.cameraFlashMode === 1) {
      icon = require('../../../assets/images/camera/ic_flash_on_white.png');
    } else if (props.cameraFlashMode === 2) {
      icon = require('../../../assets/images/camera/ic_flash_off_white.png');
    }
    return icon;
  };

  const takePicture = async () => {
    if (myRef) {
      const options = { quality: 0.3, base64: true };
      const data = await myRef.takePictureAsync(options);
      await props.setPhotoUri(data.uri);
      props.setPhotoModal(true);
    }
  };

  const switchFlash = () => {
    if (props.cameraFlashMode === 0) {
      props.setCameraFlashMode(1);
    } else if (props.cameraFlashMode === 1) {
      props.setCameraFlashMode(2);
    } else if (props.cameraFlashMode === 2) {
      props.setCameraFlashMode(0);
    }
  };

  const cameraFlash = () => {
    if (props.cameraFlashMode === 0) {
      return RNCamera.Constants.FlashMode.auto;
    }
    if (props.cameraFlashMode === 1) {
      return RNCamera.Constants.FlashMode.on;
    }
    if (props.cameraFlashMode === 2) {
      return RNCamera.Constants.FlashMode.off;
    }
    return true;
  };

  const switchType = () => {
    if (props.cameraType === 0) {
      props.setCameraType(1);
    } else if (props.cameraType === 1) {
      props.setCameraType(0);
    }
  };

  if (props.photoModal) {
    return (
      <View style={{ flex: 1, position: 'relative', justifyContent: 'flex-end' }}>
        <Image
          source={{ uri: props.photoUri }}
          style={{
            position: 'absolute', left: 0, top: 0, width, height,
          }}
        />
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => props.setPhotoModal(false)}
          >
            <Text
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: 17 * factor,
                zIndex: 100,
                marginBottom: 20,
                marginHorizontal: 20,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              CameraRoll.saveToCameraRoll(props.photoUri);
              const { photos } = props;
              if (props.backRoute === 'Manager' || props.backRoute === 'Questions') {
                photos.push({
                  uri: props.photoUri,
                  order: props.order,
                });
              } else {
                photos.push(props.photoUri);
              }
              props.navigation.state.params.addPhoto(photos);
              props.setPhotoModal(false);
            }}
          >
            <Text
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: 17 * factor,
                zIndex: 100,
                marginBottom: 20,
                marginHorizontal: 20,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container, { paddingTop: 8, paddingBottom: 8 },
      ]}
    >
      <StatusBar hidden />
      <TouchableOpacity
        onPress={() => switchFlash()}
        style={{ zIndex: 10 }}
      >
        <Image
          source={flashIcon()}
          style={{
            width: 28,
            height: 28,
            marginLeft: 32,
          }}
        />
      </TouchableOpacity>
      <RNCamera
        ref={(ref) => {
          myRef = ref;
        }}
        style={styles.preview}
        type={
          props.cameraType === 0
            ? RNCamera.Constants.Type.back
            : RNCamera.Constants.Type.front
        }
        flashMode={cameraFlash()}
        captureAudio={false}
      />
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            props.navigation.navigate(
              props.backRoute,
              { screenData: props.navigation.state.params.screenData },
            );
          }}
        >
          <Image
            source={require('../../../assets/images/camera/left.png')}
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableHighlight
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 62 * factor,
            height: 62 * factor,
            borderRadius: 32 * factor,
            borderWidth: 5 * factor,
            borderColor: '#ffffff',
            marginBottom: 12 * factor,
            marginTop: 12 * factor,
          }}
          onPress={() => takePicture()}
          underlayColor="rgba(255, 255, 255, 0.5)"
        >
          <View
            style={{
              width: 48 * factor,
              height: 48 * factor,
              borderRadius: 24 * factor,
              borderWidth: 1,
              borderColor: '#ffffff',
              backgroundColor: '#ffffff',
            }}
          />
        </TouchableHighlight>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => switchType()}
        >
          <Image
            source={require('../../../assets/images/camera/ic_camera_rear_white.png')}
            style={{
              width: 32,
              height: 32,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 0,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default (Camera);
