
const initialState = {
  photos: [],
};

export const ADD_QUESTIONS_PHOTO = 'ADD_QUESTIONS_PHOTO';

export function addQuestionPhoto(payload) {
  return {
    type: ADD_QUESTIONS_PHOTO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_QUESTIONS_PHOTO:
      console.log(action);
      return {
        ...state,
        photos: action.payload,
      };
    default:
      return state;
  }
}
