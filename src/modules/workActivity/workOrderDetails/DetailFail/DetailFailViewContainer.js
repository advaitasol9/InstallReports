import {
  compose,
} from 'recompose';
import { connect } from 'react-redux';
import { addPhoto } from '../WorkOrderDetailState';


import DetailFailView from './DetailFailView';

export default compose(
  connect(
    state => ({
      photos: state.workOrderDetail.photos,
    }),
    dispatch => ({
      addPhoto: arr => dispatch(addPhoto(arr)),
    }),
  ),
)(DetailFailView);
