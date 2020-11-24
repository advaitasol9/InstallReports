// @flow
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Platform, Image, Alert } from 'react-native';
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
    // this.props.addPhoto([]);
    if(this.props.navigation.state.params.route=="comment"){
      this.props.navigation.navigate('Message');
    }else{
      this.props.navigation.navigate('Docs');
    }
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  render() {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const FixedHeader = () => (
      // const FixedHeader = this.props => (
      <View style={styles.headerCourse}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => {
              if(this.props.navigation.state.params.route=="comment"){
                this.props.navigation.navigate('Message');
              }else{
                this.props.navigation.navigate('Docs');
              }
            }}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={async () => {
              
              if(this.props.connectionStatus){
                if (Platform.OS === 'ios') {
                  const dirs = RNFetchBlob.fs.dirs;
                  RNFetchBlob.config({
                    path: dirs.DocumentDir + '/' + this.props.navigation.state.params.name,
                    fileCache: true
                  })
                    .fetch('GET', this.props.navigation.state.params.uri, {})
                    .then(res => {
                      RNFetchBlob.ios.openDocument(res.data);
                    })
                    .catch(e => {
                      console.log('Error en el fetch: ', e);
                    });
                } else if (Platform.OS === 'android') {
                  if (await requestLocationPermission()) {
                    const item = this.props.navigation.state.params;
                    const { dirs } = RNFetchBlob.fs;
                    const dirToSave = Platform.select({
                      android: dirs.DownloadDir
                    });

                    const filePath = dirToSave + '/' + this.props.navigation.state.params.name;
                    RNFetchBlob.config({
                      fileCache: true,
                      addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: filePath
                      }
                    })
                      .fetch('GET', this.props.navigation.state.params.uri, {})
                      .then(res => {})
                      .catch((errorMessage, statusCode) => {
                        console.log('error');
                      });
                  }
                }
            }
            else{

              const destination = `${RNFetchBlob.fs.dirs.DocumentDir}/Install Reports/${this.props.navigation.state.params.name}`;
              console.log(`File opening from ${this.props.navigation.state.params.uri} to ${destination}`);
                if(Platform.OS == 'android'){
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                    if(granted){
                        RNFetchBlob.fs.cp(this.props.navigation.state.params.uri,destination).then(()=>{
                            Alert.alert("File Copied!","The document was copied into Documents folder",[{ text: 'Ok' }]);
                            console.log(`File copied: from ${this.props.navigation.state.params.uri} to ${destination}`);
                        }).catch((error)=>{
                            Alert.alert("File copying failed!","An error occured",[{ text: 'Ok' }]);
                            console.log(error);
                            console.log(`File copying failed: from ${this.props.navigation.state.params.uri} to ${destination}`);
                        });
                    }
                  
                }
                else if(Platform.OS == 'ios'){
                    console.log('iOS showing interaction menu for file: '+destination);
                  try{
                      
                    RNFetchBlob.ios.openDocument(destination);
                  }
                  catch(exception){
                    console.log(exception);
                  }
                    
                }

            }
            }}
          >
            <Text style={{ textAlign: 'right' }}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    if (this.props.navigation.state.params.type === 'application/pdf') {
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
                justifyContent: 'center'
              }}
            >
              <Loading />
            </View>
          )}
        </View>
      );
    } else if (
      this.props.navigation.state.params.type === 'application/vnd.ms-excel' ||
      this.props.navigation.state.params.type === 'text/csv' ||
      this.props.navigation.state.params.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
          <FixedHeader navigation={this.props.navigation} />
          {
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 100,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image style={styles.imageIcon} source={require('../../../assets/images/xlsx.png')} />
              <Text>{this.props.navigation.state.params.name}</Text>
            </View>
          }
        </View>
      );
    } else if (this.props.navigation.state.params.type === 'text/plain') {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
          <FixedHeader navigation={this.props.navigation} />

          {
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 100,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image style={styles.imageIcon} source={require('../../../assets/images/text-x-generic-icon.png')} />
              <Text>{this.props.navigation.state.params.name}</Text>
            </View>
          }
        </View>
      );
    } else if (
      this.props.navigation.state.params.type === 'application/msword' ||
      this.props.navigation.state.params.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
          <FixedHeader navigation={this.props.navigation} />
          {
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 100,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image style={styles.imageIcon} source={require('../../../assets/images/docx.png')} />
              <Text>{this.props.navigation.state.params.name}</Text>
            </View>
          }
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  imageIcon: {
    width: 150,
    height: 150
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGray
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16
  }
});
