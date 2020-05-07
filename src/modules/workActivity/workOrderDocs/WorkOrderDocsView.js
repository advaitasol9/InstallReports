import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import { Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import { colors, width } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
} from '../../../components';

import ImageView from 'react-native-image-view';
import { PermissionsAndroid } from 'react-native';

export default class WorkOrderDocsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isImageViewVisible: false
    };
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

    const downloadFile = (item) => {
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
        .fetch('GET', item.s3_location, {})
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

    if (this.props.isLoading === true) {
      return (
        <View style={styles.backgroundActivity}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (this.props.imageModal) {
      const images = [
        {
          source: {
            uri: this.props.imageURL,
          },
          width: 806,
          height: 720,
        },
      ];
      return (
        <ImageView
          images={images}
          imageIndex={0}
          isVisible={this.state.isImageViewVisible}
          onClose={() => {
            this.setState({ isImageViewVisible: false });
            this.props.setImageModal(!this.props.imageModal);
          }
          }
        />
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.lightGray} />
        <Header
          navigation={this.props.navigation}
          sideBar
        />
        <ScrollView styles={{ width: '100%' }}>
          <ActivityInfoSection
            navigation={this.props.navigation}
            activityData={this.props.activityData}
          />
          <ActivityStatus status={this.props.activityData.status} />
          <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
          <ActivityTitle title="Documents" />
          <View style={{ backgroundColor: colors.lightGray, paddingVertical: 16, width: '100%' }}>
            <View style={styles.scrollContainer}>
              {
                this.props.docs.length > 0
                  ? <Text style={{ width: '100%', textAlign: 'left', paddingLeft: 24 }}>Click document to view</Text>
                  : null
              }
              <View
                style={{
                  width,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 16,
                  flexWrap: 'wrap',
                }}
              >
                {!this.props.connectionStatus && (
                  <Text style={{ alignSelf: 'center' }}>There is no connection</Text>
                )}
                {this.props.connectionStatus && this.props.docs.length === 0 && (
                  <Text style={{ textAlign: 'left', paddingLeft: 25 }}>There are no documents for this work order</Text>
                )}
                {
                  this.props.connectionStatus && this.props.docs.length > 0 && this.props.docs.map((item, index) => {
                    if (item.file_type === 'image/jpeg') {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.documentContainer}
                          onPress={() => {
                            this.props.setImageURL(item.s3_location);
                            this.setState({ isImageViewVisible: true })
                            this.props.setImageModal(!this.props.imageModal);
                          }}
                        >
                          <Image
                            source={{ uri: item.s3_location }}
                            style={{
                              width: 100,
                              height: 100,
                              resizeMode: 'cover',
                            }}
                          />
                          <Text
                            style={{ paddingTop: 8, textAlign: 'center' }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    } else if (item.file_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.documentContainer}
                          onPress={async () => {
                            if (await requestLocationPermission()) {
                              downloadFile(item);
                            }
                          }}
                        >
                          <Image
                            style={{
                              height: 100,
                              width: 100,
                            }}
                            resizeMode="contain"
                            source={require('../../../../assets/images/xlsx.png')}
                          />
                          <Text style={{ paddingTop: 8, textAlign: 'center' }}>{item.name}</Text>
                        </TouchableOpacity>
                      );
                    } else if (item.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.documentContainer}
                          onPress={async () => {
                            if (await requestLocationPermission()) {
                              downloadFile(item);
                            }
                          }
                          }
                        >
                          <Image
                            style={{
                              height: 100,
                              width: 100,
                            }}
                            resizeMode="contain"
                            source={require('../../../../assets/images/docx.png')}
                          />
                          <Text style={{ paddingTop: 8, textAlign: 'center' }}>{item.name}</Text>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.documentContainer}
                          onPress={() => {
                            this.props.navigation.navigate('PdfDoc', { uri: item.s3_location, name: item.name });
                          }}
                        >
                          <Image
                            style={{
                              height: 100,
                              width: 100,
                            }}
                            resizeMode="contain"
                            source={require('../../../../assets/images/pdf.png')}
                          />
                          <Text style={{ paddingTop: 8, textAlign: 'center', alignContent: 'center', alignItems: 'center' }}>{item.name}</Text>
                        </TouchableOpacity>
                      );
                    }
                  })
                }
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray,
  },
  scrollContainer: {
    width,
    paddingBottom: 40,
  },
  documentContainer: {
    width: '40%',
    marginHorizontal: '5%',
    marginBottom: 20,
    alignItems: 'center',
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delPhoto: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
    alignItems: 'center',
  },
  delIcon: {
    color: colors.white,
    fontSize: 40,
  },
});
