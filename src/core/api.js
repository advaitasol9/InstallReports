import { Alert } from 'react-native';

import { API_PATH } from './config';

export const apiPost = (method, body, token) => {
  const url = `${API_PATH}/${method}`;
  console.log(method, body, token);
  return fetch(url, {
    method: 'POST',
    followRedirects: true,
    body,
    headers: {
      'Content-Type': 'multipart/form-data',
      'security-token': token,
    },
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiPostComment = (method, body, token) => {
  const url = `${API_PATH}/${method}`;
  console.log(method, body, token);
  return fetch(url, {
    method: 'POST',
    followRedirects: true,
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'security-token': token,
    },
  })
    .then((response) => {
      console.log(response);

      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .then((res) => {
      console.log(res);
      return (res.json());
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiChangeStatus = (status, activityId, token) => {
  const url = `${API_PATH}/spectrum/activities/${activityId}/status/${status}`;
  return fetch(url, {
    method: 'POST',
    followRedirects: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'security-token': token,
    },
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiGetJson = (method, token, contentType = 'application/json') => {
  const url = `${API_PATH}/${method}`;
  console.log(url);

  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token,
    },
  })
    .then((response) => {
      console.log(response);

      if (response && (response.status === 200 || response.status === 201)) {
        console.log(response.headers.get('app-content-full-count'));

        return response.json();
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiGet = (method, token, contentType = 'application/json') => {
  const url = `${API_PATH}/${method}`;
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token,
    },
  })
    .then((response) => {
      // eslint-disable-next-line
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiGetActivities = (method, token, contentType = 'application/json') => {
  const url = `${API_PATH}/${method}`;
  console.log(url);
  console.log(token);

  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token,
    },
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json().then(function (json) {
          return {
            "data": json,
            "appContentFullCount": response.headers.get('app-content-full-count'),
          };
        });
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};


export const auth = (method, body) => {
  const url = `${API_PATH}/${method}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body,
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      return Alert.alert('Invalid Login');
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const logout = (method, token) => {
  const url = `${API_PATH}/${method}`;
  console.log(url, token);
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'security-token': token,
    },
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiPostImage = (method, body, token) => {
  const url = `${API_PATH}/${method}`;
  console.log(url, body, token);
  return fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'multipart/form-data',
      'security-token': token,
    },
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      console.log(response);

      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(error);
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiPatchImage = (method, body, token) => {
  const url = `${API_PATH}/${method}`;
  console.log(url, body, token);
  return fetch(url, {
    method: 'PATCH',
    body,
    headers: {
      'Content-Type': 'multipart/form-data',
      'security-token': token,
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      // ADD THIS THROW error
      throw error;
    });
};

export const apiPut = (method, token, body) => {
  const url = `${API_PATH}/${method}`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
      'security-token': token,
    },
    body,
  }, 15000)
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};

export const apiPatchAnswers = (method, body, token) => {
  const url = `${API_PATH}/${method}`;
  return fetch(url, {
    method: 'PATCH',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'security-token': token,
    },
  })
    .then(response => response)
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      // ADD THIS THROW error
      throw error;
    });
};

export const apiPatch = (method, token, body) => {
  const url = `${API_PATH}/${method}`;

  return fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'security-token': token,
    },
  })
    .then((response) => {
      if (response && (response.status === 200 || response.status === 201)) {
        return response.json();
      }
      // return Alert.alert(`Error ${response.status}`, `Status Text: ${response.statusText}`);
    })
    .catch((error) => {
      // console.log(`There has been a problem with your fetch operation: ${error.message}`);
      // Alert.alert('Error', `error message: ${error.message}`);
      throw error;
    });
};
