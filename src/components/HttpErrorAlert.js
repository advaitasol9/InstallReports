import { Alert, Linking } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export default function HttpErrorAlert(errorDataObj) {

  var message = errorDataObj.message;

  return Alert.alert(
    errorDataObj.status + ' - ' + errorDataObj.title,
    message,
    [
      { text: "OK" },
      errorDataObj.action == 'auth' ? null : {
        text: 'Send Bug Report',
        onPress: async () => {
          const userData = await AsyncStorage.getItem('currentUserData');
          errorDataObj['currentUserData'] = JSON.parse(userData);
          const body=JSON.stringify(errorDataObj);
          
          Linking.openURL('mailto:jsteenbarger@doriansolutions.com?subject=DSMA Bug Found ( ' + errorDataObj.action + ' )&body=' + body);
        }
      }
    ],
    { cancelable: true }
  );
}