// @flow
import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions,
} from 'react-native';
import IO from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../../styles';
import { Button } from '../../../../components';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;


export default function WorkActivityView(props) {
  const Required = () => (
    <View style={styles.requiredBlock}>
      <Text style={styles.requiredText}>
        required
      </Text>
    </View>
  );

  return (
    <React.Fragment>
      <View style={styles.partialInstallationsHeader}>
        <Text style={styles.partialInstallations}>Partial Installation</Text>
      </View>
      <ScrollView>
        <View style={styles.scrollContainer}>
          <Text style={{ fontSize: 16 }}>
            A partial installation occurs when an installation cannot be comleted due to circumstances outside of your control.
          </Text>
          <Text style={{ fontSize: 16, marginTop: 16 }}>
            Please explain why the installationcannot be comleted. Take photos to document the situation, including any incorrect or damaged materials.
          </Text>
          <TextInput
            multiline
            placeholder="Placeholder..."
            style={[styles.inputStyle, { height: 160 }]}
          />
          <Required />
          <View style={{ marginTop: 24 }}>
            <Button bgColor={colors.blue}>
              <Text style={{ fontSize: 20, color: colors.white }}>
                Add Photo(s)
              </Text>
            </Button>
          </View>
          <Required />
          <View style={styles.photoSection}>
            <View style={styles.photoBlock}>
              <Text>Place for photo</Text>
            </View>
            <View style={styles.photoBlock}>
              <Text>Place for photo</Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TouchableOpacity>
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
          <Text style={{ fontSize: 16, marginTop: 16 }}>
            Manager on Duty Signeture:
          </Text>
          <TextInput
            multiline
            placeholder="Placeholder..."
            style={[styles.inputStyle, { height: 80 }]}
          />
          <Required />
          <TextInput
            placeholder="Enter name..."
            style={styles.inputStyle}
          />
          <Required />
          <View style={styles.buttonRow}>
            <Button
              bgColor={colors.green}
              style={{ width: '45%' }}
              onPress={() => {
                props.setModalVisible(true);
              }}
            >
              <Text style={{ fontSize: 20, color: colors.white }}>
                Submit
              </Text>
            </Button>
            <Button
              bgColor={colors.red}
              style={{ width: '45%' }}
              onPress={() => {
                props.setScreen('Main');
              }}
            >
              <Text style={{ fontSize: 20, color: colors.white }}>
                Cancel
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  photoSection: {
    marginTop: 12,
  },
  photoBlock: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  partialInstallations: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 12,
  },
  partialInstallationsHeader: {
    width: '100%',
    backgroundColor: colors.blue,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  modalContainer: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.black,
    opacity: 0.5,
    zIndex: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});
