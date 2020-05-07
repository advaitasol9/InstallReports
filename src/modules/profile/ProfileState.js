
const initialState = {
  authorizations: {},
  security_token: {},
  user: {},
  user_groups: {},
  user_roles: {},
};

export const SET_USER_INFO = 'AppState/SET_USER_INFO';

export function setUserInfo(payload) {
  return {
    type: SET_USER_INFO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        authorizations: action.payload.data.authorizations,
        security_token: action.payload.data.security_token,
        user: action.payload.data.user,
        user_groups: action.payload.data.user_groups,
        user_roles: action.payload.data.user_roles,
      };
    default:
      return state;
  }
}
