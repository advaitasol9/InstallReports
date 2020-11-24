import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { addOfflineWorkorderChanges } from '../../offlineWorkorderState';
import WorkOrderCommentView from './WorkOrderCommentView';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import { addCommentPhoto } from './WorkOrderCommentState';
import { apiGet, apiPostImage, apiPostComment, apiGetJson } from '../../../core/api';
import RNFetchBlob from 'rn-fetch-blob';
import setChangesInOffline from '../../../core/setChanges';
import { Alert } from 'react-native';
import { split } from 'lodash';
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
      saveOfflineChanges: (workOrderId, changes) => dispatch(addOfflineWorkorderChanges({ workOrderId, changes }))
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
        const data = `text=${props.comment}&user_ids=%5B${props.accountId}%5D&channel=${props.userRole}`;
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
        const data = `text=${props.comment}&user_ids=%5B${props.accountId}%5D&channel=${props.userRole}`;
        await apiPostComment(`spectrum/activities/${props.activityId}/comments`, data, props.token)
          .then(resPostText => {
            if (props.photos.length > 0 || props.photos.length) {
              props.photos.forEach(item => {
                apiGet('aws-s3-presigned-urls', props.token).then(res => {
                  RNFetchBlob.fetch(
                    'PUT',
                    res.data.url,
                    {
                      'security-token': props.token,
                      'Content-Type': 'image/jpeg'
                    },
                    RNFetchBlob.wrap(decodeURI(item.replace('file://', '')))
                  )
                    .then(() => {
                      RNFetchBlob.fs.stat(decodeURI(item.replace('file://', ''))).then(stats => {
                        const formData = new FormData();
                        formData.append('file_type', 'image/jpeg');
                        formData.append('name', stats.filename);
                        formData.append('s3_location', res.data.file_name.replace('uploads/', ''));
                        formData.append('size', stats.size);
                        apiPostImage(`activities/${props.activityId}/comments/${resPostText.data.id}/files`, formData, props.token).then(postRes => { });
                      });
                    })
                    .catch(err => {
                      console.log(err);
                    });
                });
              });
            } else {
            }
          })
          .catch(err => { });
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
        console.log("online");

        apiGetJson(`activities/${this.props.activityId}?with=["items","accounts","files"]`, this.props.token).then(response => {
          this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });

        await apiGetJson(
          `activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"${this.props.userRole}","field":"channel"}]}`,
          this.props.token
        ).then(response => {

          response.data
            .map(msg => {
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
        this.props.setActivityData(this.props.orderList.filter(order => order.id === this.props.activityId)[0]);
        currentComments = [];
        if (this.props.workOrder[this.props.activityId] != undefined) {
          await (this.props.workOrder[this.props.activityId]).map(data => {
            if (data.type == "comments") {
              var filesArray = [];
              data.payload.photos.forEach((element) => {
                filesArray.push({
                  file_type: 'image/jpeg',
                  s3_location: element
                });
              });
              currentComments.push(
                {
                  files: filesArray,
                  text: (((data.payload.text).split("&")[0]).replace("text=", "")).replace(/%20/g, " "),
                  users: [this.props.user]
                }
              );
            }
          })
        }

        if (this.props.offlineComments != undefined) {
          var offlineComments = [];
          Object.values(this.props.offlineComments).map(data => {
            if (data.activityId == this.props.activityId) {
              if (data.files.length > 0) {
                let localFiles = [];
                data.files.map(file => {
                  file.s3_location = file.local_path;
                  localFiles.push(file);
                });
                data.files = localFiles;
              }
              offlineComments.push(data);
            }
          })
        }

        console.log(currentComments);

        this.props.setData([
          ...currentComments.reverse() ?? [],
          ...offlineComments.reverse() ?? []
        ]);
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
              `activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"${this.props.userRole}","field":"channel"}]}`,
              this.props.token
            ).then(response => {
              response.data
                .map(msg => {
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
              (this.props.workOrder[this.props.activityId]).map(data => {
                if (data.type == "comments") {
                  var filesArray = [];
                  data.payload.photos.forEach((element) => {
                    filesArray.push({
                      file_type: 'image/jpeg',
                      s3_location: element
                    });
                  });
                  currentComments.push(
                    {
                      files: filesArray,
                      text: (((data.payload.text).split("&")[0]).replace("text=", "")).replace(/%20/g, " "),
                      users: [this.props.user]
                    }
                  );
                }
              })
            }


            if (this.props.offlineComments != undefined) {
              var offlineComments = [];
              Object.values(this.props.offlineComments).map(data => {
                if (data.activityId == this.props.activityId) {
                  if (data.files.length > 0) {
                    let localFiles = [];
                    data.files.map(file => {
                      file.s3_location = file.local_path;
                      localFiles.push(file);
                    });
                    data.files = localFiles;
                  }
                  offlineComments.push(data);
                }
              })
            }

            this.props.setData([
              ...currentComments.reverse() ?? [],
              ...offlineComments.reverse() ?? []
            ]);
          }
        }
      }, 10000);
    }
  })
)(WorkOrderCommentView);
