// @flow
type AppStateType = {
  isLoggedIn: boolean,
  isConnected: boolean,
  isPartModal: boolean,
};

type ActionType = {
  type: string,
  payload?: any,
};

export const initialState: AppStateType = {
  isLoggedIn: false,
  isConnected: false,
  isPartModal: false,

};

export const LOG_IN = 'AppState/LOG_IN';
export const LOG_OUT = 'AppState/LOG_OUT';
export const IS_CONNECTED = 'AppState/IS_CONNECTED';
export const IS_PART_MODAL = 'AppState/IS_PART_MODAL';

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
    default:
      return state;
  }
}
