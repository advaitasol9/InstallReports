const initialState = {
  photos: []
};

export const ADD_COMMENT_PHOTO = 'ADD_COMMENT_PHOTO';

export function addCommentPhoto(payload) {
  return {
    type: ADD_COMMENT_PHOTO,
    payload
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_COMMENT_PHOTO:
      return {
        ...state,
        photos: action.payload
      };
    default:
      return state;
  }
}
