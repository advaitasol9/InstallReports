import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import WorkOrderCommentView from './WorkOrderCommentView';
import { setChanges, setActivityId } from '../../workOrder/WorkOrderState';
import { apiGetJson } from '../../../core/api';
import { addCommentPhoto } from './WorkOrderCommentState';

export const data = [
  {
    commentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida elit sit amet orci sagittis, vel ultrices metus consectetur.',
    name: 'Skryplionak Konstantin',
    date: '02/19/19',
    time: '9.35 am',
    photos: [
      'https://cs9.pikabu.ru/post_img/big/2017/08/19/8/150314846514562633.jpg',
      'https://cs9.pikabu.ru/post_img/big/2017/08/19/8/150314846514562633.jpg',
      'https://cs9.pikabu.ru/post_img/big/2017/08/19/8/150314846514562633.jpg',
    ],
  },
  {
    commentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida elit sit amet orci sagittis, vel ultrices metus consectetur.',
    name: 'Skryplionak Konstantin',
    date: '02/19/19',
    time: '9.35 am',
    photos: [
      'https://cs9.pikabu.ru/post_img/big/2017/08/19/8/150314846514562633.jpg',
      'https://cs9.pikabu.ru/post_img/big/2017/08/19/8/150314846514562633.jpg',
      'https://cs9.pikabu.ru/post_img/big/2017/08/19/8/150314846514562633.jpg',
    ],
  },
];

export default compose(
  connect(
    state => ({
      changes: state.workOrder.changesInOffline,
      token: state.profile.security_token.token,
      activityId: state.workOrder.activityId,
      photos: state.workOrderComment.photos,
    }),
    dispatch => ({
      setActivityId: id => dispatch(setActivityId(id)),
      addPhoto: arr => dispatch(addCommentPhoto(arr)),
      setChanges: arr => dispatch(setChanges(arr)),
    }),
  ),
  withState('changesInOffline', 'setChangesInOffline', 0),
  withState('activityData', 'setActivityData', {}),
  withState('comment', 'setComment', ''),
  withState('data', 'setData', data),
  lifecycle({
    componentDidMount() {
      this.props.setChangesInOffline(this.props.changes.length);
      apiGetJson(`test-app-1/activities/${this.props.activityId}`, this.props.token)
        .then((response) => {
          this.props.setActivityData(response.data);
        });
    },
  }),
)(WorkOrderCommentView);
