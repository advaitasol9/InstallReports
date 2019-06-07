import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  View, Dimensions, StyleSheet, Text,
} from 'react-native';

import Button from './Button';
import { setPartModalVisible } from '../modules/AppState';
import { apiPost } from '../core/api';

import { colors } from '../styles';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

const PartialModal = (props) => {
  console.log(props);
  if (props.isPartModalVisible) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.background} />
        <View style={styles.modalForm}>
          <Text style={styles.modalTitle}>Are you sure?</Text>
          <Text style={styles.modalText}>
            This will close this work orderande remove it from your list. You will no longer be
            able to view or edit this work order. Your comments and attachments will be added
            to the work order and returned to dispatch to resolve any issues.
          </Text>
          <View style={styles.buttonRow}>
            <Button
              bgColor={colors.green}
              style={{ width: '45%' }}
              onPress={() => {
                props.setModalVisible(false);
                apiPost('test-app-1/spectrum/activities/1/status/Partial', {}, props.token)
                  .then((response) => {
                    console.log(response);
                  });
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
                props.setModalVisible(false);
              }}
            >
              <Text style={{ fontSize: 20, color: colors.white }}>
                Cancel
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  modalContainer: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.black,
    opacity: 0.5,
  },
  modalForm: {
    width: screenWidth * 0.9,
    minHeight: screenWidth * 0.6,
    backgroundColor: colors.white,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
  },
  modalText: {
    fontSize: 16,
    paddingTop: 32,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 32,
  },
});

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      isPartModalVisible: state.app.isPartModal,
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setPartModalVisible(payload)),
    }),
  ),
)(PartialModal);
