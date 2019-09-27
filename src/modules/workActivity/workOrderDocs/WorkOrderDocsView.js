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
} from 'react-native';
import { colors } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
} from '../../../components';

export default function WorkOrderDocsView(props) {

  if (props.isLoading === true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                ? <Text style={{ width: '100%', textAlign: 'left' }}>Click document to view</Text>
                : null
            }
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 16,
                flexWrap: 'wrap',
              }}
            >
              {
                props.docs.length > 0
                  ? props.docs.map((item) => {
                    if (item.file_type === 'image/jpeg') {
                      return (
                        <View style={{ width: '100%' }} />
                      );
                    }
                    return (
                      <TouchableOpacity
                        style={styles.documentContainer}
                        onPress={() => {
                          props.navigation.navigate('PdfDoc', { uri: item.uri });
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
                  : (
                    <View style={{ width: '100%' }}>
                      <Text style={{ alignSelf: 'center' }}>There is no documents</Text>
                    </View>
                  )
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
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  documentContainer: {
    width: '45%',
    height: 150,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});
