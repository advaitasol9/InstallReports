// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SearchView from './SearchView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({}),
  ),
)(SearchView);
