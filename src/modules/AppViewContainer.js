import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Platform, UIManager, StatusBar, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'rn-fetch-blob';

import { setConnection } from './AppState';
import { setChanges } from './workOrder/WorkOrderState';
import AppView from './AppView';
import {
  apiChangeStatus, apiGet, apiPostImage, apiPostComment,
} from '../core/api';

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
    }),
    dispatch => ({
      setConnection: mode => dispatch(setConnection(mode)),
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
  lifecycle({
    componentWillMount() {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-unused-expressions
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    },
    componentDidMount() {
      this.unsubscribe = NetInfo.addEventListener(async (state) => {
        this.props.setConnection(state.isConnected);
        if (state.isConnected && this.props.changes.length !== 0) {
          await this.props.changes.forEach((item) => {
            if (item.status !== null) {
              apiChangeStatus(item.status, item.id, this.props.token);
            }
            item.comments.forEach((comment) => {
              if (comment.changeStatus === 'In_Progress' || comment.changeStatus === item.status || comment.changeStatus === null) {
                const data = `text=${comment.comment}&user_ids=%5B${item.accountId}%5D&undefined=`;
                apiPostComment(`activities/${item.id}/comments`, data, this.props.token).then((resPostText) => {
                  if (comment.photos.length > 0) {
                    comment.photos.forEach((photo) => {
                      apiGet('aws-s3-presigned-urls', this.props.token).then((res) => {
                        RNFetchBlob.fetch('PUT', res.data.url, {
                          'security-token': this.props.token,
                          'Content-Type': 'image/jpeg',
                        }, RNFetchBlob.wrap(photo.replace('file://', '')))
                          .then(() => {
                            RNFetchBlob.fs.stat(photo.replace('file://', ''))
                              .then((stats) => {
                                const formData = new FormData();
                                formData.append('file_type', 'image/jpeg');
                                formData.append('name', stats.filename);
                                formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                                formData.append('size', stats.size);
                                apiPostImage(
                                  `activities/${item.id}/comments/${resPostText.data.id}/files`,
                                  formData,
                                  this.props.token,
                                );
                              });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      });
                    });
                  }
                });
              }
            });
          });
          await this.props.setChanges([]);
        }
      });
    },
    componentWillUnmount() {
      this.unsubscribe();
    },
  }),
)(AppView);
