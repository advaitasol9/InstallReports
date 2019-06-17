
const initialState = {
  photos: [],
};

export const ADD_PHOTO = 'ADD_PHOTO';

export function addPhoto(payload) {
  return {
    type: ADD_PHOTO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PHOTO:
      console.log(action);
      return {
        ...state,
        photos: action.payload,
      };
    default:
      return state;
  }
}
