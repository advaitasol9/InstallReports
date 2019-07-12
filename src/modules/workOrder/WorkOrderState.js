
const initialState = {
  changesInOffline: [],
  orderList: [],
  activityId: null,
};

export const SET_CHANGES = 'SET_CHANGES';
export const SET_ORDER_LIST = 'ORDER_LIST';
export const SET_ACTIVITY_ID = 'SET_ACTIVITY_ID';

export function setChanges(payload) {
  return {
    type: SET_CHANGES,
    payload,
  };
}

export function setOrderList(payload) {
  return {
    type: SET_ORDER_LIST,
    payload,
  };
}

export function setActivityId(payload) {
  return {
    type: SET_ACTIVITY_ID,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CHANGES:
      return {
        ...state,
        changesInOffline: action.payload,
      };
    case SET_ORDER_LIST:
      return {
        ...state,
        orderList: action.payload,
      };
    case SET_ACTIVITY_ID:
      return {
        ...state,
        activityId: action.payload,
      };
    default:
      return state;
  }
}
