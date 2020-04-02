
const initialState = {
  questionsPhotos: [],
  managerPhotos: [],
};

export const ADD_QUESTIONS_PHOTO = 'ADD_QUESTIONS_PHOTO';
export const ADD_MANAGER_PHOTO = 'ADD_MANAGER_PHOTO';

export function addQuestionPhoto(payload) {
  return {
    type: ADD_QUESTIONS_PHOTO,
    payload,
  };
}

export function addManagerPhoto(payload) {
  return {
    type: ADD_MANAGER_PHOTO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_QUESTIONS_PHOTO:
      return {
        ...state,
        questionsPhotos: action.payload,
      };
    case ADD_MANAGER_PHOTO:
      return {
        ...state,
        managerPhotos: action.payload,
      };
    default:
      return state;
  }
}
