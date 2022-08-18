import Cookies from 'js-cookie';

//to verify if access token is exist
export async function verifyToken() {
  //Backend has set token as cookie
  const accessToken = Cookies.get('accessToken');

  if (accessToken === null || accessToken === undefined) {
    console.log('Access token invalid, please login again');
    return false;
  } else {
    const validToken = await requestLogin(accessToken);
    return validToken;
  }
}

//set access token as headers and fetch to endpoint to verify it
async function requestLogin(accessToken) {
  const response = await fetch('http://localhost:3000/api/auth/access', {
    method: 'POST',
    credentials: 'include',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
  });

  return response.ok;
}

//async function for POST, POST, DELETE request
export async function asyncFetch(url, method, token, body, file) {
  //headers content will depended on image, if it is true no json header will be added, vice versa
  const header = file
    ? {
        authorization: `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      };

  const response = await fetch(url, {
    method: method,
    headers: header,
    body: body,
  });

  return response;
}