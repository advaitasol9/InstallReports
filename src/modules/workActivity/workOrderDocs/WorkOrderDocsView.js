import React from 'react';
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
} from 'react-native';
import IO from 'react-native-vector-icons/Ionicons';

import { colors, width } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
} from '../../../components';

export default function WorkOrderDocsView(props) {
  if (props.isLoading === true) {
    return (
      <View style={styles.backgroundActivity}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (props.imageModal) {
    return (
      <Modal
        animationType="fade"
        transparent
        visible
      >
        <View style={{ flex: 1, backgroundColor: colors.black }}>
          <StatusBar hidden />
          <TouchableOpacity
            style={styles.delPhoto}
            onPress={() => props.setImageModal(!props.imageModal)}
          >
            <IO
              style={styles.delIcon}
              name="md-close"
            />
          </TouchableOpacity>
          <Image
            source={{ uri: props.imageURL }}
            style={{
              flex: 1,
              resizeMode: 'cover',
            }}
          />
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        navigation={props.navigation}
        sideBar
      />
      <ScrollView styles={{ width: '100%' }}>
        <ActivityInfoSection
          navigation={props.navigation}
          activityData={props.activityData}
        />
        <ActivityStatus status={props.activityData.status} />
        <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
        <ActivityTitle title="Documents" />
        <View style={{ backgroundColor: colors.lightGray, paddingVertical: 16, width: '100%' }}>
          <View style={styles.scrollContainer}>
            {
              props.docs.length > 0
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
              {!props.connectionStatus && (
                <Text style={{ alignSelf: 'center' }}>There is no connection</Text>
              )}
              {props.connectionStatus && props.docs.length === 0 && (
                <Text style={{ alignSelf: 'center' }}>There is no documents</Text>
              )}
              {
                props.connectionStatus && props.docs.length > 0 && props.docs.map((item) => {
                  if (item.file_type === 'image/jpeg') {
                    return (
                      <TouchableOpacity
                        style={styles.documentContainer}
                        onPress={() => {
                          props.setImageURL(item.s3_location);
                          props.setImageModal(!props.imageModal);
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
                          style={{ paddingTop: 8 }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      style={styles.documentContainer}
                      onPress={() => {
                        props.navigation.navigate('PdfDoc', { uri: item.s3_location });
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
                      <Text style={{ paddingTop: 8 }}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })
              }
            </View>
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
    width,
    paddingBottom: 40,
  },
  documentContainer: {
    width: '40%',
    marginHorizontal: '5%',
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
