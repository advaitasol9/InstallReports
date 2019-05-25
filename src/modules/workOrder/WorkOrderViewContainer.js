import { compose, lifecycle } from 'recompose';
import { apiGetJson } from '../../core/api';

import WorkOrderScreen from './WorkOrderView';

export default compose(
  lifecycle({
    componentDidMount() {
      apiGetJson('test-app-1/activities/')
        .then((response) => {
          console.log(response);
        });
    },
  }),
)(WorkOrderScreen);
