import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { addOfflineWorkorderChanges, saveCommentsOffline } from '../../offlineWorkorderState';
import WorkOrderCommentView from './WorkOrderCommentView';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import { addCommentPhoto } from './WorkOrderCommentState';
import { apiGet, apiPostImage, apiPostComment, apiGetJson } from '../../../core/api';
import RNFetchBlob from 'rn-fetch-blob';
import setChangesInOffline from '../../../core/setChanges';
import { Alert } from 'react-native';
import { split } from 'lodash';
import { uploadCommentFile } from '../../../core/fileHandle';
export default compose(
  connect(
    state => ({
      accountId: state.profile.user.id,
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      photos: state.workOrderComment.photos,
      user: state.profile.user,
      userRole: state.profile.user_roles[0].name,
      workOrder: state.offlineWorkOrder.workOrderChanges,
      offlineWorkOrder: state.offlineWorkOrder.workOrders,
      offlineComments: state.offlineWorkOrder.comments,
      test: state
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addCommentPhoto(arr)),
      setChanges: arr => dispatch(setChanges(arr)),
      saveOfflineChanges: (workOrderId, changes) => dispatch(addOfflineWorkorderChanges({ workOrderId, changes })),
      saveCommentsOffline: comments => dispatch(saveCommentsOffline(comments))
    })
  ),
  withState('numOfChanges', 'setNumOfChanges', 0),
  withState('activityData', 'setActivityData', {}),
  withState('comment', 'setComment', ''),
  withState('data', 'setData', []),
  withState('offlineData', 'setOfflineData', []),
  withState('isLoading', 'setIsloading', true),
  withState('imageURL', 'setImageURL', ''),
  withState('imageModal', 'setImageModal', false),
  withState('isCommentLoading', 'setCommentIsloading', true),

  withHandlers({
    onSubmit: props => async () => {
      if (!props.connectionStatus) {
        Alert.alert('No Internet connection', "You're now working offline");
        const data = `text=${props.comment}&user_ids=%5B${props.accountId}%5D&channel=${(props.userRole == "installer" || props.userRole == "installer-sub") ? "installer":props.userRole}`;
        const changes = [{ type: 'comments', payload: { text: data, photos: props.photos } }];
        await props.saveOfflineChanges(props.activityId, changes);

        var filesArray = [];
        await props.photos.forEach(element => {
          filesArray.push({
            file_type: 'image/jpeg',
            s3_location: element
          });
        });
        await props.setData([
          {
            files: filesArray,
            text: props.comment,
            users: [props.user]
          },
          ...props.data
        ]);
        await props.addPhoto([]);
        await props.setComment('');
      } else {
        const data = `text=${props.comment}&user_ids=%5B${props.accountId}%5D&channel=${
          props.userRole == 'installer' || props.userRole == 'installer-sub' ? 'installer' : props.userRole
        }`;
        const resPostText = await apiPostComment(`spectrum/activities/${props.activityId}/comments`, data, props.token);

        var photos=[]
        if (props.photos.length > 0 || props.photos.length) {
          photos= props.photos.map;
        }
        const promises = props.photos.map(async item => {
   
          try {
            const { data } = await uploadCommentFile(item, resPostText.data.id, props.activityId, props.token); //
            const hasOfflineData = props.offlineWorkOrder[props.activityId] !== undefined;

            if (hasOfflineData) {
              let fileObject = data;
              const destination = RNFetchBlob.fs.dirs.DocumentDir + '/Install Reports/comments_files/' + fileObject.name;
              console.log('src:' + item);
              console.log('dst:' + destination);

              const path = RNFetchBlob.fs.dirs.DocumentDir + '/Install Reports/comments_files/' + fileObject.name;
              RNFetchBlob.config({
                path: path
              })
                .fetch('GET', fileObject.s3_location)
                .then(() => {
                  console.log(`comment file saved: ${path}`);
                  fileObject = { ...fileObject, s3_location: `file://${path}`, local_path: `file://${path}` };
                  commentForOffline.files.push(fileObject);
                });
            }
          } catch (e) {
            return false;
          }
        });
        await Promise.all(promises);
        props.addPhoto([]);
        props.setComment('');
      }
    }
  }),
  lifecycle({
    async componentWillMount() {
      this.props.setNumOfChanges(this.props.changes.length);

      console.log('refresh whole comments');
      clearInterval(this._interval);

      if (this.props.navigation.state.params && this.props.navigation.state.params.screenData.text) {
        this.props.setComment(this.props.navigation.state.params.screenData.text);
      }
      if (this.props.connectionStatus) {
        console.log('online');

        await apiGetJson(`activities/${this.props.activityId}?with=["items","accounts","files"]`, this.props.token).then(response => {
          this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });

        await apiGetJson(
          `activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"${(this.props.userRole == "installer" || this.props.userRole == "installer-sub") ? "installer":this.props.userRole}","field":"channel"}]}`,
          this.props.token
        ).then(response => {
          response.data.map(msg => {
            const regex = /(<([^>]+)>)/gi;
            const result = msg.text.replace(regex, '');
            const result1 = result.replace('&nbsp;', ' ');
            msg.text = result1;
          });
          this.props.setData(response.data.reverse());
          this.props.setIsloading(false);
          this.props.setCommentIsloading(false);
        });
      } else {
        await this.props.setActivityData(this.props.offlineWorkOrder[this.props.activityId]);

        currentComments = [];
        if (this.props.workOrder[this.props.activityId] != undefined) {
          await this.props.workOrder[this.props.activityId].map(data => {
            if (data.type == 'comments') {
              var filesArray = [];
              data.payload.photos.forEach(element => {
                filesArray.push({
                  file_type: 'image/jpeg',
                  s3_location: element
                });
              });
              currentComments.push({
                files: filesArray,
                text: data.payload.text
                  .split('&')[0]
                  .replace('text=', '')
                  .replace(/%20/g, ' '),
                users: [this.props.user]
              });
            }
          });
        }

        if (this.props.offlineComments != undefined) {
          var offlineComments = [];
          Object.values(this.props.offlineComments).map(data => {
            if (data.activityId == this.props.activityId) {
              if (data.files != undefined && data.files.length > 0) {
                let localFiles = [];
                data.files.map(file => {
                  file.s3_location = file.local_path;
                  localFiles.push(file);
                });
                data.files = localFiles;
              }
              offlineComments.push(data);
            }
          });
        }

        console.log(currentComments);

        this.props.setData([...(currentComments.reverse() ?? []), ...(offlineComments.reverse() ?? [])]);
        this.props.setIsloading(false);
        this.props.setCommentIsloading(false);
      }
    },
    componentDidMount() {
      this._interval = setInterval(() => {
        if (this.props.activityId == null) {
          clearInterval(this._interval);
        } else {
          if (this.props.connectionStatus) {
            apiGetJson(
              `activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"${(this.props.userRole == "installer" || this.props.userRole == "installer-sub") ? "installer":this.props.userRole}","field":"channel"}]}`,
              this.props.token
            ).then(response => {
              response.data.map(msg => {
                const regex = /(<([^>]+)>)/gi;
                const result = msg.text.replace(regex, '');
                const result1 = result.replace('&nbsp;', ' ');
                msg.text = result1;
              });
              this.props.setData(response.data.reverse());
              this.props.setIsloading(false);
              this.props.setCommentIsloading(false);
            });
          } else {
            currentComments = [];
            if (this.props.workOrder[this.props.activityId] != undefined) {
              this.props.workOrder[this.props.activityId].map(data => {
                if (data.type == 'comments') {
                  var filesArray = [];
                  data.payload.photos.forEach(element => {
                    filesArray.push({
                      file_type: 'image/jpeg',
                      s3_location: element
                    });
                  });
                  currentComments.push({
                    files: filesArray,
                    text: data.payload.text
                      .split('&')[0]
                      .replace('text=', '')
                      .replace(/%20/g, ' '),
                    users: [this.props.user]
                  });
                }
              });
            }

            if (this.props.offlineComments != undefined) {
              var offlineComments = [];
              Object.values(this.props.offlineComments).map(data => {
                if (data.activityId == this.props.activityId) {
                  if (data.files != undefined && data.files.length > 0) {
                    let localFiles = [];
                    data.files.map(file => {
                      file.s3_location = file.local_path;
                      localFiles.push(file);
                    });
                    data.files = localFiles;
                  }
                  offlineComments.push(data);
                }
              });
            }

            this.props.setData([...(currentComments.reverse() ?? []), ...(offlineComments.reverse() ?? [])]);
          }
        }
      }, 10000);
    }
  })
)(WorkOrderCommentView);
