import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import {
  View, Dimensions, StyleSheet, Text, Modal,
} from 'react-native';

import Button from './Button';
import { setPartModalVisible } from '../modules/AppState';
import { addPartialPhoto } from '../modules/workActivity/workOrderDetails/DetailPartial/DetailPartialState';

import { colors } from '../styles';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

const PartialModal = (props) => {
  if (props.isPartModalVisible) {
    return (
      <Modal
        animationType="fade"
        transparent
        visible
      >
        <View
          style={styles.modalContainer}
        >
          <View style={styles.modalForm}>
            <Text style={styles.modalTitle}>Succeed</Text>
            <Text style={styles.modalText}>
              This will close this work order and remove it from your list. You will no longer be
              able to view or edit this work order. Your comments and attachments will be added
              to the work order and returned to dispatch to resolve any issues.
            </Text>
            <View style={styles.buttonRow}>
              <Button
                bgColor={colors.green}
                style={{ width: '100%' }}
                onPress={async () => {
                  await props.setModalVisible(false);
                  await props.navigation.navigate('Work Order');
                  await props.addPhoto([]);
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
    height: screenHeight,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
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
      accountId: state.profile.user.id,
      token: state.profile.security_token.token,
      isPartModalVisible: state.app.isPartModal,
      photos: state.detailPartial.photos,
      activityId: state.workOrder.activityId,
    }),
    dispatch => ({
      setModalVisible: payload => dispatch(setPartModalVisible(payload)),
      addPhoto: arr => dispatch(addPartialPhoto(arr)),
    }),
  ),
)(withNavigation(PartialModal));
