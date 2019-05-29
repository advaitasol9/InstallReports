
const initialState = {
  changesInOffline: [],
};

export const SET_CHANGES = 'SET_CHANGES';

export function setChanges(payload) {
  return {
    type: SET_CHANGES,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CHANGES:
      console.log(action);
      return {
        ...state,
        changesInOffline: action.payload,
      };
    default:
      return state;
  }
}
