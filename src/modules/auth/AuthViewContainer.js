// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { setAppOpened } from '../AppState';

import AuthView from './AuthView';

export default compose(
  connect(
    state => ({
      authState: state.app,
    }),
    dispatch => ({
      setAppOpened: () => dispatch(setAppOpened()),
    }),
  ),
  lifecycle({
    componentDidMount() {
      console.log('navelny');
      if (this.props.authState.isFirstOpen) {
        console.log('navelny');
        this.props.navigation.navigate({ routeName: 'Main' });
      }
    },
  }),
)(AuthView);
