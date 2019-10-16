import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IO from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../styles';
import {
  Header,
  Button,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
} from '../../../components';

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};

export default function WorkOrderQuestionsView(props) {
  const renderPhoto = photo => (
    <Image source={{ uri: photo }} style={styles.photoBlock} />
  );

  if (props.isLoading === true) {
    return (
      <View style={styles.backgroundActivity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        navigation={props.navigation}
        sideBar
      />
      <ScrollView style={{ width: '100%' }}>
        <ActivityInfoSection
          navigation={props.navigation}
          activityData={props.activityData}
        />
        <ActivityStatus status={props.activityData.status} />
        <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
        <ActivityTitle title="Manager on Duty Feedback" />
        <View style={{ backgroundColor: colors.lightGray, width: '100%' }}>
          <View style={styles.scrollContainer}>
            <Text>1. Did you take BEFORE picture? If NO please answer why</Text>
            <TextInput
              multiline
              placeholder="Placeholder..."
              style={[styles.inputStyle, { height: 160 }]}
            />
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
            <View style={styles.photoSection}>
              { props.photos.map(photo => renderPhoto(photo)) }
            </View>
            <TouchableOpacity
              style={{
                display: props.photos.length === 0 ? 'none' : 'flex',
                alignItems: 'center',
                width: '100%',
              }}
              onPress={() => {
                console.log('to tuta');
                props.addPhoto([]);
              }}
            >
              <IO
                style={{
                  color: colors.red,
                  fontSize: 48,
                  marginTop: 16,
                }}
                name="md-close-circle"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray,
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingVertical: 16,
  },
  documentContainer: {
    width: '45%',
    height: 150,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: 14,
    marginTop: 32,
    backgroundColor: colors.white,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlignVertical: 'top',
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backgroundActivity: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
