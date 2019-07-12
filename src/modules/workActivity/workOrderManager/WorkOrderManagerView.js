import React from 'react';
import {
  StyleSheet, View, Text, StatusBar, ScrollView, TextInput,
} from 'react-native';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { Dropdown } from 'react-native-material-dropdown';

import { colors } from '../../../styles';
import {
  Header,
  Button,
  ManagerModal,
  ActivityInfoSection,
  ActivityTitle,
  ActivityStatus,
} from '../../../components';

export default function WorkOrderManagerView(props) {
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
        <ActivityTitle title="Manager on Duty Feedback" />
        <ScrollView style={{ backgroundColor: colors.lightGray, width: '100%' }}>
          <View style={[styles.scrollContainer, { paddingBottom: 8 }]}>
            <Text>Was the installer friendly and professional?</Text>
            <Dropdown
              label=""
              data={[
                {
                  value: 'Yes',
                }, {
                  value: 'No',
                },
              ]}
            />
          </View>
          <View style={[styles.scrollContainer, { paddingBottom: 8 }]}>
            <Text>Are you satisfied with installation?</Text>
            <Dropdown
              label=""
              data={[
                {
                  value: 'Yes',
                }, {
                  value: 'No',
                },
              ]}
            />
          </View>
          <View style={styles.scrollContainer}>
            <Text>Comments</Text>
            <TextInput
              multiline
              placeholder="Placeholder..."
              style={[styles.inputStyle, { height: 160 }]}
            />
          </View>
          <View style={styles.scrollContainer}>
            <Text>Manager on Duty Signature</Text>
            <RNSketchCanvas
              containerStyle={[
                styles.inputStyle,
                {
                  height: 200,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                },
              ]}
              canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              strokeColor={colors.primary}
              clearComponent={(
                <View style={styles.functionButton}>
                  <Text style={{ color: colors.primary }}>
                    Clear
                  </Text>
                </View>
              )}
              onStrokeEnd={(path) => {
                const { signature } = props;
                signature.push(path.path.data);
                props.setSignature(signature);
              }}
            />
          </View>
          <View style={[styles.scrollContainer, { borderBottomWidth: 0 }]}>
            <Text>Manager on Duty Typed Name</Text>
            <TextInput
              placeholder="Name"
              style={styles.inputStyle}
            />
          </View>
          <View style={[styles.scrollContainer, { borderBottomWidth: 0 }]}>
            <Button
              bgColor={colors.green}
              onPress={() => {
                console.log(props);
                props.setModalVisible(true);
              }}
            >
              <Text style={{ fontSize: 20, color: colors.white }}>
                Submit
              </Text>
            </Button>
          </View>
        </ScrollView>
        <ManagerModal />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
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
  requiredBlock: {
    width: '100%',
    alignItems: 'flex-end',
  },
  requiredText: {
    fontSize: 12,
    marginTop: 8,
    color: colors.darkGray,
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    margin: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
