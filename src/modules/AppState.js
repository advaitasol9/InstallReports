// @flow
type AppStateType = {
  isLoggedIn: boolean,
};

type ActionType = {
  type: string,
  payload?: any,
};

export const initialState: AppStateType = {
  isFirstOpen: true,
};

export const LOG_IN = 'AppState/LOG_IN';
export const LOG_OUT = 'AppState/LOG_OUT';


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

export default function AppStateReducer(
  state: AppStateType = initialState,
  action: ActionType,
): AppStateType {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isLoggedIn: false,
      };
    case LOG_OUT:
      return {
        ...state,
        isLoggedIn: true,
      };
    default:
      return state;
  }
}
