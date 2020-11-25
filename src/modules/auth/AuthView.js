import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { Alert, Animated, Keyboard, LayoutAnimation, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { API_PATH } from '../../../env';
import { version } from '../../../package.json';
import { Button, TextInput } from '../../components';
import { auth, getEnv } from '../../core/api';
import { setNewPath, state } from '../../core/mainEnv';
import { colors, fonts } from '../../styles';
export default class AuthScreen extends React.Component {
    
  state = {...state,anim: new Animated.Value(0),
    // Current visible form
    isKeyboardVisible: false,
    dropdownVisible: false,
    env: []};
  constructor() {
    super();
    let versionString = version;
    versionString = versionString.match(/^\d+\.\d+/g);
    const formattedVersion = versionString.length > 0 ? versionString[0] : '0.0';
    this.state = { ...this.state, version: formattedVersion };
    
  }

  componentWillMount() {
    getEnv()
      .then(response => {
        const endpoints = response.data;
        console.log('getEnv Response:');
        console.log(response);
        if (state.apiPath == '') {
          setNewPath(endpoints[0].end_point_url, null);
        }

        if (endpoints.length > 0) {
          let data = [];
          Object.keys(endpoints).forEach(key => {
            data.push({ key: endpoints[key].end_point_url, value: endpoints[key].name });
          });
          
          this.setState({ env: data });
        } else {
          if (state.apiPath == '') {
            setNewPath(API_PATH, null);
          }
        }
      })
      .catch(err => {console.log(err)});

    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }),
      this._keyboardDidHide.bind(this)
    );
  }

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    
  }

  setFormData(password, email) {
    if (!this.props.connectionStatus) {
      Alert.alert('No Internet Connection');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (state.apiPath == '' || state.apiPath == undefined) {
      Alert.alert('Select Environment', 'Click the "Change environment" button and select the Environment');
      return;
    }
    auth('login/', formData)
      .then(response => {
        this.props.setPassword('');
        this.props.setEmail('');
        this.storeUserData(response.data.user);
        this.props.setUserInfo(response);
        this.storeAuthResponse(response);
        this.storeSelectedAPI(state);
        this.props.logIn(state);
        this.props.navigation.navigate({ routeName: 'Home' });
      })
      .catch(e => {
        Alert.alert('401 - Login Failed', 'Your email or password was incorrect. Please try again.', [{ text: 'Ok' }]);
        this.props.setPassword('');
      });
  }

  storeUserData = async data => {
    await AsyncStorage.setItem('currentUserData', JSON.stringify(data));
  };

  storeSelectedAPI = async selectedAPI => {
    await AsyncStorage.setItem('selectedEndpoint',JSON.stringify(selectedAPI));
  }

  storeAuthResponse = async response => {
    await AsyncStorage.setItem('savedAuthResponse',JSON.stringify(response));
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: 'clamp'
          })
        }
      ]
    };
  }

  _keyboardDidShow() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: true });
  }

  _keyboardDidHide() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: false });
  }

  render() {

    if(!this.props.authState.isLoggedIn){
      return (
        <View style={styles.backgroundImage}>
          <View style={styles.container}>
            <Text
              style={{
                position: 'absolute',
                right: 32,
                top: 24,
                color: 'black',
                fontSize: 12
              }}
            >
              v {this.state.version}
            </Text>
            <View style={[styles.section, { paddingTop: 30 }]}>
              <Animated.Image
                resizeMode="contain"
                style={[styles.logo, this.state.isKeyboardVisible && { height: 30 }, this.fadeIn(0)]}
                source={require('../../../assets/images/logo-white.png')}
              />
            </View>
  
            <Animated.View style={[styles.section, styles.middle, this.fadeIn(700, -20)]}>
              <TextInput
                placeholder="Email"
                style={styles.textInput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={text => this.props.setEmail(text)}
                value={this.props.email}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.textInput}
                onChangeText={text => this.props.setPassword(text)}
                value={this.props.password}
              />
              <Animated.View style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}>
                <Button
                  bgColor="white"
                  textColor={colors.primary}
                  rounded
                  style={{ alignSelf: 'stretch', marginBottom: 10, marginTop: 30 }}
                  caption="Login"
                  onPress={() => {
                    this.setFormData(this.props.password, this.props.email);
                  }}
                />
  
                {!this.state.isKeyboardVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL('https://installreports.com/reset-password');
                    }}
                    style={{ paddingTop: 30, flexDirection: 'row' }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: fonts.primaryRegular
                      }}
                    >
                      Forgot your password?
                    </Text>
                  </TouchableOpacity>
                )}
                {!this.state.isKeyboardVisible && !this.state.dropdownVisible && (
                  <Animated.View style={styles.dropdownNew}>
                    <Dropdown
                      label="Environment"
                      data={this.state.env}
                      baseColor="rgba(255, 255, 255, 0.0)"
                      value={state.name}
                      ref={ref => (this.dropDownRef = ref)}
                      style={{ color: 'rgba(255, 255, 255, 0.0)' }}
                      dropdownOffset={{ top: 10, left: 0 }}
                      shadeOpacity={0.12}
                      value="Production"
                      onChangeText={text => {
                        const selectedItem = this.state.env.filter(answer => answer.value == text)[0];
                        setNewPath(null, selectedItem);
                        return true;
                      }}
                    />
                  </Animated.View>
                )}
                {!this.state.isKeyboardVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      this.dropDownRef.focus();
                    }}
                    style={{ paddingTop: 30, flexDirection: 'row' }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: fonts.primaryRegular,
                        flexDirection: 'column',
                        marginBottom: 70,
                        fontSize: 11
                      }}
                    >
                      Change Environment
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </Animated.View>
          </View>
        </View>
      );
    }else{
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30
  },
  backgroundImage: {
    backgroundColor: '#808080',
    flex: 1
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  middle: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'stretch'
  },
  bottom: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Platform.OS === 'android' ? 30 : 0
  },
  last: {
    justifyContent: 'flex-end'
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 20
  },
  logo: {
    height: 40
  },
  socialLoginContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 15,
    justifyContent: 'space-between'
  },
  socialButton: {
    flex: 1
  },
  socialButtonCenter: {
    marginLeft: 10,
    marginRight: 10
  },
  dropdownNew: {
    flex: 1,
    alignSelf: 'auto',
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
    width: 130,
    color: 'white'
  }
});