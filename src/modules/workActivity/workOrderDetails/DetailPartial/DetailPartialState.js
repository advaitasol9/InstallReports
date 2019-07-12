
const initialState = {
  photos: [],
};

export const ADD_PARTIAL_PHOTO = 'ADD_PARTIAL_PHOTO';

export function addPartialPhoto(payload) {
  return {
    type: ADD_PARTIAL_PHOTO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PARTIAL_PHOTO:
      console.log(action);
      return {
        ...state,
        photos: action.payload,
      };
    default:
      return state;
  }
}
