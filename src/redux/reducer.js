import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import profile from '../modules/profile/ProfileState';
import workOrder from '../modules/workOrder/WorkOrderState';

export default combineReducers({
  // ## Generator Reducers
  app,
  profile,
  workOrder,
});
