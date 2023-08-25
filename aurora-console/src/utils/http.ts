import { BASE_URL } from '../config';

const retryQueue: {
  url: string;
  init: RequestInit | undefined;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];
let isRefreshing = false;

/**
 * token will expired in 5 minutes
 * @param token
 * @returns
 */
function isTokenWillExpired(token: string) {
  return token.length > 1;
  // const tokenExpireTime = JSON.parse(atob(token.split('.')[1])).exp;
  // return tokenExpireTime - Date.now() / 1000 < 5 * 60;
}

function refreshToken(token: string) {
  // TODO: refresh token
  // return Promise.resolve(token);
  return new Promise((resolve: (token: string) => void) => {
    setTimeout(() => {
      console.log('refresh token, oldToken: ', token);
      resolve('6');
    }, 0);
  });
}

localStorage.setItem('token', '6666');

export const invokeApi = (url: string, init?: RequestInit) => {
  const token = localStorage.getItem('token');
  // const token = '6666';
  if (!token) {
    // TODO: redirect to login page
    return Promise.reject('no token');
  }
  if (isTokenWillExpired(token)) {
    console.log('token will expired');

    if (isRefreshing) {
      console.log('push to retry queue');

      return new Promise((resolve, reject) => {
        retryQueue.push({ url, init, resolve, reject });
      });
    } else {
      console.log('start to refresh token');
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken(token)
          .then((newToken) => {
            console.log('refresh token success', newToken);

            localStorage.setItem('token', newToken);
            isRefreshing = false;

            invokeApi(url, init).then(resolve, reject);

            console.log('start to retry queue');
            retryQueue.forEach((item) => {
              console.log('start to retry');
              invokeApi(item.url, item.init).then(item.resolve, item.reject);
            });
          })
          .catch(() => {
            reject('refresh token failed');
            // TODO: redirect to login page
          });
      });
    }
  }

  console.log('invoke api', url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise<any>((resolve, reject) => {
    const headers = {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    };

    const newInit = {
      ...init,
      headers,
    };

    fetch(BASE_URL + url, newInit)
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          reject(res);
        }
      })
      .catch(reject);
  });
};
