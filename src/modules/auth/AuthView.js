import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Animated,
  Keyboard,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { TextInput, Button } from '../../components';
import { auth } from '../../core/api';
import { fonts, colors } from '../../styles';

export default class AuthScreen extends React.Component {
  state = {
    anim: new Animated.Value(0),

    // Current visible form
    isKeyboardVisible: false,
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }),
      this._keyboardDidHide.bind(this),
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
    } else {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      auth('test-app-1/login/', formData).then((response) => {
        console.log(response);
        if (!this.props.connectionStatus) {
          Alert.alert('There is no connection');
        }
        if (response.errorCode) {
          Alert.alert('A valid email and password must be entered to log in.');
          this.props.setPassword('');
        } else {
          this.props.setPassword('');
          this.props.setEmail('');
          this.props.setUserInfo(response);
          this.props.logIn();
          this.props.navigation.navigate({ routeName: 'Home' });
        }
      });
    }
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
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
    return (
      <View style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text
            style={{
              position: 'absolute', right: 32, top: 24, color: 'black', fontSize: 12,
            }}
          >
            v 0.7
          </Text>
          <View style={[styles.section, { paddingTop: 30 }]}>
            <Animated.Image
              resizeMode="contain"
              style={[
                styles.logo,
                this.state.isKeyboardVisible && { height: 90 },
                this.fadeIn(0),
              ]}
              source={require('../../../assets/images/white-logo.png')}
            />
          </View>

          <Animated.View
            style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
          >
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
            <Animated.View
              style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
            >
              <Button
                bgColor="white"
                textColor={colors.primary}
                rounded
                style={{ alignSelf: 'stretch', marginBottom: 10 }}
                caption="Login"
                onPress={() => {
                  this.setFormData(this.props.password, this.props.email);
                }}
              />
              {!this.state.isKeyboardVisible && (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL('https://trello.com/c/8FtwG3Wi');
                  }}
                  style={{ paddingTop: 30, flexDirection: 'row' }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: fonts.primaryRegular,
                    }}
                  >
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  backgroundImage: {
    backgroundColor: '#808080',
    flex: 1,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  bottom: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  last: {
    justifyContent: 'flex-end',
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  logo: {
    height: 150,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
  },
  socialButtonCenter: {
    marginLeft: 10,
    marginRight: 10,
  },
});
