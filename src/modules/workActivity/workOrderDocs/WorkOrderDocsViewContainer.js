// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import WorkOrderDocsView from './WorkOrderDocsView';
import { setActivityId } from '../../workOrder/WorkOrderState';
import { files } from '../../offlineWorkorderState';
import { apiGetJson } from '../../../core/api';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      // itemId: state.workOrder.itemId,
      connectionStatus: state.app.isConnected,
      orderList: state.workOrder.orderList,
      offlineWorkOrders: state.offlineWorkOrder.workOrders,
      offlineFiles: state.offlineWorkOrder.files
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id))
    })
  ),
  withState('inProgress', 'setInProgress', false),
  withState('activityData', 'setActivityData', {}),
  withState('docs', 'setDocs', []),
  withState('isLoading', 'setIsloading', true),
  withState('imageURL', 'setImageURL', ''),
  withState('imageModal', 'setImageModal', false),
  withState('hasOfflineDocs', 'setHasOfflineDocs', false),
  lifecycle({
    componentDidMount() {
      if (this.props.connectionStatus) {
        apiGetJson(`activities/${this.props.activityId}?with=["items"]`, this.props.token).then(async response => {
          await this.props.setActivityData(response.data);
          this.props.setIsloading(false);
        });

        apiGetJson(`activities/${this.props.activityId}/files`, this.props.token).then(response => {
          this.props.setDocs(response.data);
        });
      } else {

        const offlineWorkOrder = this.props.offlineWorkOrders[this.props.activityId];

        let files = [];
        if(this.props.offlineFiles){
          Object.keys(this.props.offlineFiles).forEach((fileId)=>{
            if(this.props.offlineFiles[fileId].activityId === this.props.activityId){
              let fileObject = this.props.offlineFiles[fileId];
              fileObject.s3_location = fileObject.local_path;
              console.log(`Offline doc: ${fileObject.local_path}`);
              files.push(fileObject);
            }
          });
        }

        this.props.setActivityData(offlineWorkOrder);

        this.props.setHasOfflineDocs(files.length > 0 ?true:false);
        this.props.setDocs(files);
        
        this.props.setIsloading(false);
      }
    }
  })
)(WorkOrderDocsView);
