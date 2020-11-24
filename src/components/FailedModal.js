import React, { Component } from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { setPartModalVisible } from '../modules/AppState';
import { colors } from '../styles';
import Button from './Button';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

const styles = StyleSheet.create({
  modalContainer: {
    height: screenHeight,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center'
  },
  modalForm: {
    width: screenWidth * 0.9,
    minHeight: screenWidth * 0.6,
    backgroundColor: colors.white,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 28
  },
  modalText: {
    fontSize: 16,
    paddingTop: 32
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 32
  }
});

const FailedModal = compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      isPartModalVisible: state.app.isPartModal
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setPartModalVisible(payload))
    })
  )
);

class FailedModalComponent extends Component {
  render() {
    if (this.props.mainProps.confirmModalOpened) {
      return (
        <Modal animationType="fade" transparent visible>
          <View style={styles.modalContainer}>
            <View style={styles.modalForm}>
              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Text style={styles.modalText}>
                This will close this work order and remove it from your list. You will no longer be able to view or edit this work order. Your comments and
                attachments will be added to the work order and returned to dispatch to resolve any issues.
              </Text>
              <View style={styles.buttonRow}>
                <Button
                  bgColor={colors.green}
                  style={{ width: '48%' }}
                  onPress={() => this.props.onSubmit()}
                  textColor={colors.white}
                  caption="Submit"
                  isLoading={this.props.mainProps.isSubmitLoading}
                  textStyle={{ fontSize: 20 }}
                />
                <Button
                  bgColor={colors.red}
                  style={{ width: '48%' }}
                  onPress={() => {
                    this.props.mainProps.setConfirmModalOpened(false);
                  }}
                  textColor={colors.white}
                  textStyle={{ fontSize: 20 }}
                  caption="Cancel"
                />
              </View>
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  }
}
export default FailedModal(FailedModalComponent);
