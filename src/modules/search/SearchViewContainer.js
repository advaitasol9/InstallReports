import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { apiGetJson } from '../../core/api';

import SearchView from './SearchView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
    }),
    dispatch => ({}),
  ),
  withState('orderList', 'setOrderList', []),
  lifecycle({
    async componentDidMount() {
      const data = await apiGetJson('test-app-1/activities/', this.props.token);
      this.props.setOrderList(data.data);
    },
  }),
)(SearchView);
