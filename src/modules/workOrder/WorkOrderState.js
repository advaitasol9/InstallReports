const initialState = {
  changesInOffline: [],
  orderList: [],
  activityId: null,
  itemId: null,
  workOrdersFullCount: null,
};

export const SET_CHANGES = 'SET_CHANGES';
export const SET_ORDER_LIST = 'ORDER_LIST';
export const SET_ACTIVITY_ID = 'SET_ACTIVITY_ID';
export const SET_ITEM_ID = 'SET_ITEM_ID';
export const SET_WORK_ORDERS_FULL_COUNT = 'SET_WORK_ORDERS_FULL_COUNT';

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

export function setWorkOrdersFullCount(payload) {
  return {
    type: SET_WORK_ORDERS_FULL_COUNT,
    payload,
  };
}

export function setActivityId(payload) {
  return {
    type: SET_ACTIVITY_ID,
    payload,
  };
}

export function setItemId(payload) {
  return {
    type: SET_ITEM_ID,
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
    case SET_ITEM_ID:
      return {
        ...state,
        itemId: action.payload,
      };
    case SET_WORK_ORDERS_FULL_COUNT:
      return {
        ...state,
        workOrdersFullCount: action.payload,
      };
    default:
      return state;
  }
}
