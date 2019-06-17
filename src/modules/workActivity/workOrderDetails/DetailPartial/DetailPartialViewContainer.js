import {
  compose,
} from 'recompose';
import { connect } from 'react-redux';
import { addPhoto } from '../WorkOrderDetailState';


import DetailPartialView from './DetailPartialView';

export default compose(
  connect(
    state => ({
      photos: state.workOrderDetail.photos,
    }),
    dispatch => ({
      addPhoto: arr => dispatch(addPhoto(arr)),
    }),
  ),
)(DetailPartialView);
