import { WORKORDER_FAILED_ATTEMPT_UPDATED } from '../redux/actions/workOrderFailedAttemptActions';
import { WORKORDER_GEO_LOCATION_CHANGED, WORKORDER_STATUS_CHANGED } from '../redux/actions/workOrderPreInsallActions';
import { WORKORDER_QUESTION_ANSWERS_UPDATED } from '../redux/actions/workOrderQuestionsActions';

type OfflineWorkOderStateType = {
  workOrders: any,
  workOrderChanges: any,
  photos: any,
  files: any,
  comments: any
};

type ActionType = {
  type: string,
  payload?: any
};

const initialState: OfflineWorkOderStateType = {
  workOrders: {},
  workOrderChanges: {},
  photos: {},
  files: {},
  comments: {}
};

const SAVE_WORKORDER_OFFLINE = 'OfflineWorkoderState/SAVE_WORKORDER_OFFLINE';
const ADD_OFFLINE_WORKORDER_CHANGES = 'OfflineWorkoderState/ADD_WORKORDER_CHANGES';
const UPDATE_OFFLINE_WORKORDER_CHANGES = 'OfflineWorkOrdersState/UPDATE_OFFLINE_WORKORDER_CHANGES';
const SAVE_PHOTO_OFFLINE = 'OfflineWorkorderState/SAVE_PHOTO_OFFLINE';
const SAVE_FILES_OFFLINE = 'OfflineWorkorderState/SAVE_FILES_OFFLINE';
const SAVE_COMMENTS_OFFLINE = 'OfflineWorkorderState/SAVE_COMMENTS_OFFLINE';

export function saveWorkOrderOffline(payload): ActionType {
  return { type: SAVE_WORKORDER_OFFLINE, payload };
}

export function addOfflineWorkorderChanges(payload): ActionType {
  return { type: ADD_OFFLINE_WORKORDER_CHANGES, payload };
}

export function savePhotoOffline(payload): ActionType {
  return { type: SAVE_PHOTO_OFFLINE, payload };
}

export function updateOfflineWorkOrderChanges(payload) {
  return { type: UPDATE_OFFLINE_WORKORDER_CHANGES, payload };
}

export function saveFilesOffline(payload): ActionType {
  return { type: SAVE_FILES_OFFLINE, payload };
}

export function saveCommentsOffline(payload): ActionType {
  return {type: SAVE_COMMENTS_OFFLINE,payload};
}

export default function offlineWorkorderStateReducer(state: OfflineWorkOderStateType = initialState, action: ActionType): OfflineWorkOderStateType {
  switch (action.type) {
    case SAVE_WORKORDER_OFFLINE:
      return { ...state, workOrders: { ...state.workOrders, [action.payload.id]: action.payload } };

    case ADD_OFFLINE_WORKORDER_CHANGES:
      const changes = state.workOrderChanges[action.payload.workOrderId] ?? [];
      return { ...state, workOrderChanges: { ...state.workOrderChanges, [action.payload.workOrderId]: [...changes, ...action.payload.changes] } };

    case UPDATE_OFFLINE_WORKORDER_CHANGES:
      return { ...state, workOrderChanges: action.payload };

    case SAVE_PHOTO_OFFLINE:
      return { ...state, photos: { ...state.photos, [action.payload.id]: action.payload } };

    case WORKORDER_STATUS_CHANGED:
      if (state.workOrders[action.payload.id]) {
        return {
          ...state,
          workOrders: { ...state.workOrders, [action.payload.id]: { ...state.workOrders[action.payload.id], status: action.payload.status } }
        };
      }
      return state;

    case WORKORDER_GEO_LOCATION_CHANGED:
      if (state.workOrders[action.payload.id]) {
        return {
          ...state,
          workOrders: { ...state.workOrders, [action.payload.id]: { ...state.workOrders[action.payload.id], geo_location: action.payload.geo_location } }
        };
      }
      return state;

    case WORKORDER_QUESTION_ANSWERS_UPDATED:
      if (state.workOrders[action.payload.id]) {
        return {
          ...state,
          workOrders: {
            ...state.workOrders,
            [action.payload.id]: {
              ...state.workOrders[action.payload.id],
              installer_questions_answers: JSON.stringify(action.payload.installer_questions_answers)
            }
          }
        };
      }
      return state;

    case WORKORDER_FAILED_ATTEMPT_UPDATED:
      if (state.workOrders[action.payload.id]) {
        return {
          ...state,
          workOrders: {
            ...state.workOrders,
            [action.payload.id]: {
              ...state.workOrders[action.payload.id],
              failed_installation_comment_id: action.payload.comment_id,
              failed_installation_manager_name: action.payload.manager_name
            }
          }
        };
      }
      return state;

    case SAVE_FILES_OFFLINE:
      return {...state, files: {...state.files, [action.payload.id]:action.payload}};

    case SAVE_COMMENTS_OFFLINE:
      return {...state, comments: {...state.comments, [action.payload.id]: action.payload}};

    default:
      return state;
  }
}
