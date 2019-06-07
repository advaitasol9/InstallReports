// @flow
import React from 'react';
import {
  StyleSheet, View, Text, Dimensions,
} from 'react-native';

import { colors } from '../../../../styles';
import { Button } from '../../../../components';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;


export default function WorkActivityView(props) {
  return (
    <React.Fragment>
      <Button
        bgColor={colors.red}
        style={{ width: '45%' }}
        onPress={() => {
          props.setScreen('Main');
        }}
      >
        <Text style={{ fontSize: 20, color: colors.white }}>
          Back to Details
        </Text>
      </Button>
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
