
const initialState = {
  photos: [],
};

export const ADD_FAILURE_PHOTO = 'ADD_FAILURE_PHOTO';

export function addFailPhoto(payload) {
  return {
    type: ADD_FAILURE_PHOTO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FAILURE_PHOTO:
      console.log(action);
      return {
        ...state,
        photos: action.payload,
      };
    default:
      return state;
  }
}
