// @flow
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Loading } from '../../components';
import { colors, width, height } from '../../styles';
import RNFetchBlob from 'rn-fetch-blob';

import { BackHandler } from 'react-native';
import { PermissionsAndroid } from 'react-native';

export default class PdfContainer extends Component {

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  handleBackButtonClick = () => {
    this.props.addPhoto([]);
    this.props.navigation.navigate('Docs');
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  render() {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err)
      }
    }

    const FixedHeader = () => (
      // const FixedHeader = this.props => (
      <View style={styles.headerCourse}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => {
              this.props.navigation.navigate('Docs');
            }}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={async () => {
              if (await requestLocationPermission()) {
                const item = this.props.navigation.state.params;
                const { dirs } = RNFetchBlob.fs;
                const dirToSave = Platform.select({
                  ios: dirs.DownloadDir,
                  android: dirs.DownloadDir
                });
                const filePath = dirToSave + '/' + item.name;
                RNFetchBlob
                  .config({
                    fileCache: true,
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: true,
                      path: filePath
                    },
                  })
                  .fetch('GET', item.uri, {})
                  .then((res) => {
                    RNFetchBlob.fs.writeFile(filePath, res.data, 'base64');
                    if (Platform.OS === 'ios') {
                      RNFetchBlob.ios.previewDocument(filePath);
                    }
                  })
                  .catch((errorMessage, statusCode) => {
                    console.log('error')
                  });
              }
            }}
          >
            <Text style={{ textAlign: 'right' }}>Download</Text>
          </TouchableOpacity>
        </View>
      </View >
    );
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <FixedHeader navigation={this.props.navigation} />
        <Pdf
          style={{ width, height: height - 64 }}
          onError={error => console.log(error)}
          onLoadComplete={() => this.props.setIsLoaded(true)}
          source={{ uri: this.props.navigation.state.params.uri }}
        />
        {!this.props.isLoaded && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 100,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loading />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGray,
  },
  headerCourse: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16,
  },
});
