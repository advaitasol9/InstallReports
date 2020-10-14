import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  View, Dimensions, StyleSheet, Text, Modal
} from 'react-native';

import Button from './Button';
import { setPartModalVisible } from '../modules/AppState';
import { addPartialPhoto } from '../modules/workActivity/workOrderDetails/DetailPartial/DetailPartialState';

import { colors } from '../styles';

import {
  apiChangeStatus, apiGet, apiPostImage, apiPostComment, apiPatch
} from '../core/api';
import setChangesInOffline from '../core/setChanges';
import RNFetchBlob from 'rn-fetch-blob';

const { height, width } = Dimensions.get('window');
export const screenHeight = height;
export const screenWidth = width;

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

const ParialModal = compose(
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
);

class ParialModalComponent extends Component {
  constructor(props) {
    super(props);
    uploadedImagesCount = 0;
    isSignatureUploaded = false;
    this.state = {
      isLoading: false
    };
  }

  isLastImageUploaded() {
    if (this.uploadedImagesCount == this.props.mainProps.photos.length && this.isSignatureUploaded) {
      this.setState({
        isLoading: false
      });
      this.props.mainProps.addPhoto([]);
      this.props.mainProps.setSignature([]);
      this.props.mainProps.navigation.navigate('Work Order');
    }
  }

  render() {
    if (this.props.isPartModalVisible) {
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
              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Text style={styles.modalText}>
                This will close this work order and remove it from your list. You will no longer be
                able to view or edit this work order. Your comments and attachments will be added
                to the work order and returned to dispatch to resolve any issues.
            </Text>
              <View style={styles.buttonRow}>
                <Button
                  bgColor={colors.green}
                  style={{ width: '48%' }}
                  onPress={async () => {
                    this.setState({
                      isLoading: true
                    });
                    if (!this.props.mainProps.connectionStatus) {
                      setChangesInOffline(
                        this.props.mainProps.changes,
                        this.props.mainProps.setChanges,
                        this.props.mainProps.setNumOfChanges,
                        this.props.mainProps.comment,
                        this.props.mainProps.activityId,
                        this.props.mainProps.accountId,
                        this.props.mainProps.photos,
                        'Partial',
                      );
                      this.props.mainProps.setModalVisible(true);
                      this.setState({
                        isLoading: false
                      });
                    } else {
                      const data = `text=${this.props.mainProps.comment}&user_ids=[${this.props.mainProps.accountId}]`;
                      await apiPostComment(`activities/${this.props.mainProps.activityId}/comments`, data, this.props.mainProps.token).then((resPostText) => {
                        Promise.all([
                          apiChangeStatus('Partial', this.props.mainProps.activityId, this.props.token),
                          apiPatch(`activities/` + this.props.mainProps.activityId, this.props.token,
                            {
                              'partial_installation_manager_name': this.props.mainProps.name,
                              'partial_installation_comment_id': resPostText.data.id,
                            }),
                        ]).then((res) => {
                        }).catch((err) => {
                          console.log(err);
                        });
                        if (this.props.mainProps.photos.length > 0) {
                          this.props.mainProps.photos.forEach((item, index) => {
                            apiGet('aws-s3-presigned-urls', this.props.mainProps.token).then((res) => {
                              RNFetchBlob.fetch('PUT', res.data.url, {
                                'security-token': this.props.mainProps.token,
                                'Content-Type': 'image/jpeg',
                              }, RNFetchBlob.wrap(item.replace('file://', '')))
                                .then(() => {
                                  RNFetchBlob.fs.stat(item.replace('file://', ''))
                                    .then((stats) => {
                                      const formData = new FormData();
                                      formData.append('file_type', 'image/jpeg');
                                      formData.append('name', stats.filename);
                                      formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                      formData.append('size', stats.size);
                                      apiPostImage(
                                        `activities/${this.props.mainProps.activityId}/comments/${resPostText.data.id}/files`,
                                        formData, this.props.mainProps.token,
                                      );
                                      this.uploadedImagesCount = index + 1;
                                      this.isLastImageUploaded();
                                    });
                                })
                                .catch((err) => {
                                  this.setState({
                                    isLoading: false
                                  });
                                  console.log(err);
                                });
                            }).catch((error) => {
                              this.setState({
                                isLoading: false
                              });
                            });
                          });
                        }
                        if (this.props.mainProps.signature.length == 1) {
                          apiGet('aws-s3-presigned-urls', this.props.mainProps.token).then((res) => {
                            RNFetchBlob.fetch('PUT', res.data.url, {
                              'security-token': this.props.mainProps.token,
                              'Content-Type': 'image/jpeg',
                            }, this.props.mainProps.signature[0])
                              .then(() => {
                                const formData = new FormData();
                                formData.append('file_type', 'image/jpeg');
                                formData.append('name', 'partial_sign.jpg');
                                formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                formData.append('size', this.props.mainProps.signature[0].length);
                                apiPostImage(
                                  `activities/${this.props.mainProps.activityId}/comments/${resPostText.data.id}/files`,
                                  formData, this.props.mainProps.token,
                                );
                                this.isSignatureUploaded = true;
                                this.isLastImageUploaded();
                              })
                              .catch((err) => {
                                this.setState({
                                  isLoading: false
                                });
                                console.log(err);
                              });
                          });
                        }
                      });
                    }
                  }}
                  textColor={colors.white}
                  caption="Submit"
                  isLoading={this.state.isLoading}
                  textStyle={{ fontSize: 20 }}
                />
                <Button
                  bgColor={colors.red}
                  style={{ width: '48%' }}
                  onPress={() => {
                    this.props.mainProps.setModalVisible(false);
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

export default ParialModal(ParialModalComponent)