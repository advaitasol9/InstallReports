// @flow
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import CameraView from './CameraView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
  withState('cameraType', 'setCameraType', 0),
  withState('cameraFlashMode', 'setCameraFlashMode', 0),
  withState('photoUri', 'setPhotoUri', ''),
  withState('photoModal', 'setPhotoModal', false),
  withState('photos', 'setPhotos', []),
  withState('backRoute', 'setBackRoute', ''),
  lifecycle({
    componentDidMount() {
      this.props.setPhotos(this.props.navigation.state.params.photos);
      this.props.setBackRoute(this.props.navigation.state.params.screen);
    },
  }),

)(CameraView);
