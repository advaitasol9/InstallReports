
import { API_PATH } from './config';

export const apiGet = (method) => {
  const url = `${API_PATH}/${method}`;
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const apiPost = (method, body, token = API_TOKEN_CONFIG) => {
  const url = `${API_PATH}/${method}`;

  return fetch(url, {
    method: 'POST',
    followRedirects: true,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': token,
    },
  });
};

export const apiGetJson = (method) => {
  const url = `${API_PATH}/${method}`;

  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    console.log('apiGetJson', url, response);
    // eslint-disable-next-line
    if (response && (response.status === 200 || response.status === 201 || response.status === 204)) {
      console.log(response);
    }
    console.log(response.json());
    return {
      errorCode: response.status,
    };
  });
};

export const apiPut = (method, token = API_TOKEN_CONFIG, body) => {
  const url = `${API_PATH}/${method}`;

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': token,
    },
    body: JSON.stringify(body),
  }).then((response) => {
    if (response && (response.status === 200 || response.status === 201)) {
      return response.json();
    }
    if (response && (response.status === 404 || response.status === 400)) {
      return {
        errorCode: 'user-not-found',
      };
    }
    return {};
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
