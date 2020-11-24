import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import profile from '../modules/profile/ProfileState';
import workOrder from '../modules/workOrder/WorkOrderState';
import detailFail from '../modules/workActivity/workOrderDetails/DetailFail/DetailFailState';
import detailPartial from '../modules/workActivity/workOrderDetails/DetailPartial/DetailPartialState';
import detailPreInstall from '../modules/workActivity/workOrderDetails/DetailPreInstall/DetailPreInstallState';
import workOrderQuestion from '../modules/workActivity/workOrderQuestions/WorkOrderQuestionsState';
import workOrderComment from '../modules/workActivity/workOrderComment/WorkOrderCommentState';
import offlineWorkOrder from '../modules/offlineWorkorderState';

export default combineReducers({
  // ## Generator Reducers
  app,
  profile,
  workOrder,
  detailFail,
  detailPartial,
  detailPreInstall,
  workOrderQuestion,
  workOrderComment,
  offlineWorkOrder
});
