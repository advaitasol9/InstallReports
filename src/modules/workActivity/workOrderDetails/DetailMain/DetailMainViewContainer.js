import { PermissionsAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import RNFetchBlob from 'rn-fetch-blob';
import { apiGet, apiGetJson } from '../../../../core/api';
import { setPartModalVisible } from '../../../AppState';
import { savePhotoOffline, saveWorkOrderOffline, saveFilesOffline, saveCommentsOffline } from '../../../offlineWorkorderState';
import { setActivityId, setChanges } from '../../../workOrder/WorkOrderState';
import DetailMainView from './DetailMainView';
var RNFS = require('react-native-fs');

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      activityId: state.workOrder.activityId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      token: state.profile.security_token.token,
      userRole: state.profile.user_roles[0].name,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      offlineChanges: state.offlineWorkOrder.workOrderChanges,
      offlineFiles: state.offlineWorkOrder.files
    }),
    dispatch => ({
      setChanges: arr => dispatch(setChanges(arr)),
      setModalVisible: payload => dispatch(setPartModalVisible(payload)),
      setActivityId: id => dispatch(setActivityId(id)),
      setWorkOrderOffline: workorder => dispatch(saveWorkOrderOffline(workorder)),
      savePhotoOffline: photo => dispatch(savePhotoOffline(photo)),
      saveFilesOffline: files => dispatch(saveFilesOffline(files)),
      saveCommentsOffline: comments => dispatch(saveCommentsOffline(comments)),
    })
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('activityData', 'setActivityData', {}),
  withState('isLoading', 'setIsLoading', true),
  withState('details', 'setDetails', []),
  withHandlers({
    saveWorkOrder: props => async workOrder => {
      const installerQuestions = JSON.parse(workOrder.installer_questions_answers) ?? [];
      const files = workOrder.files ?? [];
      const comments = workOrder.workOrderComments ?? [];


      let photos = [];
      installerQuestions.forEach(question => {
        if (question.type == 'photo') {
          photos = [...photos, ...(question.answers ?? [])];
          return;
        }
        if (question.type == 'signature') {
          if (question.answers) {
            photos.push(question.answers);
          }
          return;
        }

        photos = [...photos, ...(question.photo ?? [])];
      });

      let dir;
      let androidPermission;

      if (Platform.OS == 'ios') {
        dir = RNFetchBlob.fs.dirs.DocumentDir + '/Install Reports/';
      } else {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        androidPermission = granted == PermissionsAndroid.RESULTS.GRANTED;
        dir = RNFetchBlob.fs.dirs.pictureDir + '/Install Reports/';
      }

      if (Platform.OS != 'android' || androidPermission) {
        const res = await apiGet(`files?search={"id":[` + photos + `]}`, props.token);

        await Promise.all((res.data ?? []).map(async image => {
          const path = dir + image.name;
          await RNFetchBlob.config({
            path: path
          }).fetch('GET', image.s3_location);
          const uuid = Date.now() + '' + Math.floor(Math.random() * 100);
          props.savePhotoOffline({ ...image, local_path: `file://${path}`, uuid });
        }));

        await Promise.all(files.map(async file => {
          
          const path = RNFetchBlob.fs.dirs.DocumentDir + '/Install Reports/' + file.name;
          let ref = await RNFetchBlob.config({
            path: path
          })
            .fetch('GET', file.s3_location)
            .then(() => {
              console.log(`File was saved in : ${path}`);
            });
          props.saveFilesOffline({ activityId: props.activityId, ...file, local_path: `file://${path}` });
        }));

        await Promise.all(comments.map(async comment => {
          
          var commentFiles = [];
          if(comment.files != undefined && comment.files.length > 0)
          {

            await Promise.all(comment.files.map(async file => {
                  const path = RNFetchBlob.fs.dirs.DocumentDir + '/Install Reports/comments_files/' + file.name;
                  await RNFetchBlob.config({
                    path: path
                  })
                  .fetch('GET',file.s3_location)
                  .then(()=>{
                    console.log(`comment file saved: ${path}`);
                  });
                  commentFiles.push({...file,local_path: `file://${path}`});
            }));
                   
          }
          comment = {...comment,files: commentFiles};
          props.saveCommentsOffline({activityId:props.activityId, ...comment});

        }));

      }
      console.log('photo saved');
      props.setWorkOrderOffline(workOrder);
    }
  }),
  lifecycle({
    async componentDidMount() {
      if (this.props.connectionStatus) {
        var responseData = {};
        await apiGetJson(`activities/${this.props.activityId}?with=["items","accounts","files"]`, this.props.token).then(async response => {
          responseData = response.data;
        });
        await apiGetJson(`activities/${this.props.activityId}/comments?search={"fields":[{"operator":"equals","value":"${(this.props.userRole == "installer" || this.props.userRole == "installer-sub") ? "installer":this.props.userRole}","field":"channel"}]}`,
          this.props.token
        )
        
          .then(comments => {
            comments.data.map(msg => {
              const regex = /(<([^>]+)>)/gi;
              const result = msg.text.replace(regex, '');
              const result1 = result.replace('&nbsp;', ' ');
              msg.text = result1;
            });
            responseData.workOrderComments = comments.data;
            this.props.setActivityData(responseData);

            if (this.props.offlineWorkOrders[this.props.activityId]) {
              console.log(responseData);
              this.props.saveWorkOrder(responseData);
            }
            this.props.setIsLoading(false);
          });
      } else {
        let workOrder = this.props.offlineWorkOrders[this.props.activityId];
        console.log(workOrder);

        if (workOrder) {
          const changes = this.props.offlineChanges[this.props.activityId] ?? [];

          changes.forEach(change => {
            workOrder = { ...workOrder, [change.type]: change.payload };
          });
        }

        this.props.setActivityData(workOrder);
        this.props.setIsLoading(false);
      }
    }
  })
)(DetailMainView);
