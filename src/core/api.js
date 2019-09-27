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
  }).then(response => response)
    .then((res) => {
      console.log(res);
      return (res.json());
    });
};

export const apiChangeStatus = (status, activityId, token) => {
  const url = `${API_PATH}/test-app-1/spectrum/activities/${activityId}/status/${status}`;
  return fetch(url, {
    method: 'POST',
    followRedirects: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'security-token': token,
    },
  });
};

export const apiGetJson = (method, token, contentType = 'application/json') => {
  const url = `${API_PATH}/${method}`;

  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token,
    },
  }).then((response) => {
    // eslint-disable-next-line
    if (response && (response.status === 200 || response.status === 201)) {
      return response.json();
    }
    return {
      errorCode: response.status,
    };
  });
};

export const apiGet = (method, token, contentType = 'application/json') => {
  const url = method;
  console.log(url);
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': contentType,
      'security-token': token,
    },
  }).then((response) => {
    // eslint-disable-next-line
    if (response && (response.status === 200 || response.status === 201)) {
      return response.json();
    }
    return {
      errorCode: response.status,
    };
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
  }).then((response) => {
    console.log(response);
    if (response && (response.status === 200 || response.status === 201)) {
      console.log(response);
      return response.json();
    }
    if (response.ok === false) {
      return {
        errorCode: 'user-not-found',
      };
    }
    return {};
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
  }).then((response) => {
    console.log(response);
    if (response && (response.status === 200 || response.status === 201)) {
      return response.json();
    }
    if (response.status === 401) {
      return {
        errorCode: 'invalid_security_token',
      };
    }
    return {};
  });
};

export const apiPostImage = (method, body, token) => {
  const url = method;
  console.log(url, body, token);
  return fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'multipart/form-data',
      'security-token': token,
    },
  }).then((response) => {
    console.log(response);
    return response.json();
  });
};

export const apiPatchImage = (method, body, token) => {
  const url = method;
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
      return response.json();
    })
    .catch((error) => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`);
      // ADD THIS THROW error
      throw error;
    });
};

export const apiPut = (method, token, body) => {
  const url = method;

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
      'security-token': token,
    },
    body,
  }, 15000).then((response) => {
    console.log('apiPut then', { url, body, response });
  });
};
