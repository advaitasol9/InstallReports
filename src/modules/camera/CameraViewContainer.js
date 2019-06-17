// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { addPhoto } from '../workActivity/workOrderDetails/WorkOrderDetailState';

import CameraView from './CameraView';

export default compose(
  connect(
    state => ({
      photos: state.workOrderDetail.photos,
    }),
    dispatch => ({
      addPhoto: arr => dispatch(addPhoto(arr)),
    }),
  ),
  withState('cameraType', 'setCameraType', 0),
  withState('cameraFlashMode', 'setCameraFlashMode', 0),
  withState('photoUri', 'setPhotoUri', ''),
  withState('photoModal', 'setPhotoModal', false),
  lifecycle({
    componentDidMount() {
      console.log(this.props.navigation.state.params.activityId);
    },
  }),

)(CameraView);
