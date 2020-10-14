import { API_PATH } from './../../env';
import { HttpErrorHandler } from './handlers';
import { HttpErrorAlert } from '../components';
import fetchToCurl from 'fetch-to-curl';
import AsyncStorage from '@react-native-community/async-storage';
import { state } from '../core/mainEnv';

export const apiPostComment = (method, body, token) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'POST',
    followRedirects: true,
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      throw [response, CURL, 'apiPostComment'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiChangeStatus = (status, activityId, token) => {
  const url = state.apiPath + `/spectrum/activities/${activityId}/status/${status}`;
  const options = {
    method: 'POST',
    followRedirects: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiChangeStatus'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiGetJson = (method, token, contentType = 'application/json') => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiGetJson'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiGet = (method, token, contentType = 'application/json') => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiGet'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiGetActivities = (method, token, contentType = 'application/json') => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json().then(function(json) {
          return {
            data: json,
            appContentFullCount: response.headers.get('app-content-full-count')
          };
        });
      }

      throw [response, CURL, 'apiGetActivities'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const auth = (method, body) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    },
    body
  };
  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'auth'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error, {
        401: { title: 'Login Failed', message: 'Your email or password was incorrect. Please try again.' }
      });
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const logout = (method, token) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(async response => {
      if (response && (response.status === 200 || response.status === 201)) {
        await AsyncStorage.removeItem('currentUserData');
        return response.json();
      }
      throw [response, CURL, 'logout'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiPostImage = (method, body, token) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'multipart/form-data',
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);
  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiPostImage'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiPut = (method, token, body) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
      'security-token': token
    },
    body
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options, 15000)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiPut'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiPatchAnswers = (method, body, token) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      }
      throw [response, CURL, 'apiPatchAnswers'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      console.log(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};

export const apiPatch = (method, token, body) => {
  const url = state.apiPath + `/${method}`;
  const options = {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'security-token': token
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiPatch'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};
export const getEnv = (contentType = 'application/json') => {
  const url = API_PATH + '/spectrum/environments';
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType
    }
  };

  const CURL = fetchToCurl(url, options);

  return fetch(url, options)
    .then(response => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }

      throw [response, CURL, 'apiGet'];
    })
    .catch(error => {
      var errorMsg = HttpErrorHandler.generateErrorMessage(error);
      HttpErrorAlert(errorMsg);
      throw errorMsg;
    });
};
