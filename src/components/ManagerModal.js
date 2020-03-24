import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import {
  View, Dimensions, StyleSheet, Text, Modal,
} from 'react-native';

import Button from './Button';
import { setManagerModalVisible } from '../modules/AppState';

import { colors } from '../styles';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

const ManagerModal = (props) => {
  if (props.isModalVisible) {
    return (
      <Modal
        animationType="fade"
        transparent
        visible
      >
        <View style={styles.modalContainer}>
          <View style={styles.background} />
          <View style={styles.modalForm}>
            <Text style={styles.modalTitle}>Work Order Complete!</Text>
            <Text style={styles.modalText}>
              Thank you! This work order is now complete and will be submitted for internal review.
              It will be removed from the active work order list.
            </Text>
            <View style={styles.buttonRow}>
              <Button
                bgColor={colors.green}
                style={{ width: '100%' }}
                onPress={() => {
                  props.setModalVisible(false);
                  props.navigation.navigate('Work Order');
                }}
                textColor={colors.white}
                caption="OK"
                textStyle={{ fontSize: 20 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 32,
  },
});


export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      isModalVisible: state.app.isManagerModal,
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setManagerModalVisible(payload)),
    }),
  ),
)(withNavigation(ManagerModal));
