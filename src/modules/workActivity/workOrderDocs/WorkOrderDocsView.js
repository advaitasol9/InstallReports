import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { colors } from '../../../styles';
import {
  Header,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
} from '../../../components';

export default function WorkOrderDocsView(props) {
  console.log(props);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.lightGray} />
      <Header
        navigation={props.navigation}
        sideBar
      />
      <React.Fragment>
        <ActivityInfoSection
          navigation={props.navigation}
          activityData={props.activityData}
        />
        {
          props.status === 3 && (
            <React.Fragment>
              <ActivityStatus status={props.status} />
              <View style={{ width: '100%', height: 24, backgroundColor: colors.white }} />
            </React.Fragment>
          )
        }
        <ActivityTitle title="Documents" />
        <ScrollView style={{ backgroundColor: colors.lightGray, paddingVertical: 16, width: '100%' }}>
          <View style={styles.scrollContainer}>
            <Text style={{ width: '100%', textAlign: 'left' }}>Click document to view</Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 16,
              }}
            >
              <TouchableOpacity
                style={styles.documentContainer}
                onPress={() => {
                  props.navigation.navigate('PdfDoc', { uri: 'http://www.africau.edu/images/default/sample.pdf' });
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
                <Text style={{ paddingTop: 8 }}>Doc Name</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.documentContainer}
                onPress={() => {
                  props.navigation.navigate('PdfDoc', { uri: 'http://www.africau.edu/images/default/sample.pdf' });
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
                <Text style={{ paddingTop: 8 }}>Doc Name</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </React.Fragment>
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
