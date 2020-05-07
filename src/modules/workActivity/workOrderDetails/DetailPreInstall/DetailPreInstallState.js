
const initialState = {
  photos: [],
};

export const ADD_PREINSTALL_PHOTO = 'ADD_PREINSTALL_PHOTO';

export function addPreInstallPhoto(payload) {
  return {
    type: ADD_PREINSTALL_PHOTO,
    payload,
  };
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PREINSTALL_PHOTO:
      return {
        ...state,
        photos: action.payload,
      };
    default:
      return state;
  }
}
