// @flow
type AppStateType = {
  isLoggedIn: boolean,
  isConnected: boolean,
  isPartModal: boolean,
  isManagerModal: boolean,
  isIncompleteModal: boolean,
};

type ActionType = {
  type: string,
  payload?: any,
};

export const initialState: AppStateType = {
  isLoggedIn: false,
  isConnected: false,
  isPartModal: false,
  isManagerModal: false,
  isIncompleteModal: false,
};

export const LOG_IN = 'AppState/LOG_IN';
export const LOG_OUT = 'AppState/LOG_OUT';
export const IS_CONNECTED = 'AppState/IS_CONNECTED';
export const IS_PART_MODAL = 'AppState/IS_PART_MODAL';
export const IS_FAILED_MODAL = 'AppState/IS_FAILED_MODAL';
export const IS_MANAGER_MODAL = 'AppState/IS_MANAGER_MODAL';
export const IS_INCOMPLETE_MODAL = 'AppState/IS_INCOMPLETE_MODAL';

export function logIn(): ActionType {
  return {
    type: LOG_IN,
  };
}

export function logOut(): ActionType {
  return {
    type: LOG_OUT,
  };
}

export function setConnection(payload): ActionType {
  return {
    type: IS_CONNECTED,
    payload,
  };
}

export function setPartModalVisible(payload): ActionType {
  return {
    type: IS_PART_MODAL,
    payload,
  };
}

export function setFailedModalVisible(payload): ActionType {
  return {
    type: IS_FAILED_MODAL,
    payload,
  };
}

export function setManagerModalVisible(payload): ActionType {
  return {
    type: IS_MANAGER_MODAL,
    payload,
  };
}

export function setIncompleteModalVisible(payload): ActionType {
  return {
    type: IS_INCOMPLETE_MODAL,
    payload,
  };
}

export default function AppStateReducer(
  state: AppStateType = initialState,
  action: ActionType,
): AppStateType {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOG_OUT:
      return {
        ...state,
        isLoggedIn: false,
      };
    case IS_CONNECTED:
      return {
        ...state,
        isConnected: action.payload,
      };
    case IS_PART_MODAL:
      return {
        ...state,
        isPartModal: action.payload,
      };
    case IS_FAILED_MODAL:
      return {
        ...state,
        isPartModal: action.payload,
      };
    case IS_MANAGER_MODAL:
      return {
        ...state,
        isManagerModal: action.payload,
      };
    case IS_INCOMPLETE_MODAL:
      return {
        ...state,
        isIncompleteModal: action.payload,
      };
    default:
      return state;
  }
}
