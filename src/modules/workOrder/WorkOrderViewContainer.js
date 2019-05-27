import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { apiGetJson } from '../../core/api';

import WorkOrderScreen from './WorkOrderView';

export default compose(
  connect(
    state => ({
      token: state.profile.security_token.token,
    }),
    dispatch => ({}),
  ),
  lifecycle({
    componentDidMount() {
      console.log(this.props);
      apiGetJson('test-app-1/activities/', this.props.token)
        .then((response) => {
          console.log(response);
        });
    },
  }),
)(WorkOrderScreen);
