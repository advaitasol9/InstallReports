// @flow
import { compose, withState, lifecycle } from 'recompose';

import CameraView from './CameraView';

export default compose(
  withState('cameraType', 'setCameraType', 0),
  withState('cameraFlashMode', 'setCameraFlashMode', 0),
  withState('photoUri', 'setPhotoUri', ''),
  withState('photoModal', 'setPhotoModal', false),
  withState('photos', 'setPhotos', []),
  withState('backRoute', 'setBackRoute', ''),
  withState('order', 'setOrder', 0),
  lifecycle({
    componentDidMount() {
      this.props.setPhotos(this.props.navigation.state.params.photos);
      this.props.setBackRoute(this.props.navigation.state.params.screen);
      if (this.props.navigation.state.params.screen === 'Manager' || this.props.navigation.state.params.screen === 'Questions') {
        this.props.setOrder(this.props.navigation.state.params.order);
      }
    }
  })
)(CameraView);
