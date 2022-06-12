import Cookies from 'js-cookie'

//to verify if access token is exist
export async function verifyToken() {
  const accessToken = Cookies.get('accessToken')

  if (accessToken === null || accessToken === undefined) {
    console.log('Access token invalid, please login again')
    return false
  } else {
    console.log('ready to set to request login')
    const validToken = await requestLogin(accessToken)
    return validToken
  }
}

//set access token as headers and fetch to endpoint to verify it
async function requestLogin(accessToken) {
  const response = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    //check what error does the server return, to determine actions
    console.log('Server error / token invalide')
    return false
  } else {
    //token is okay, can redirect user to protected page
    console.log('successfully set headers')
    return true
  }
}

//async function for POST, POST, DELETE request
export const asyncFetch = async (url, method, token, body, image) => {
  //headers content will depended on image, if it is true no json header will be added, vice versa
  const header = image
    ? {
        authorization: `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      }

  try {
    const response = await fetch(url, {
      method: method,
      headers: header,
      body: body,
    })

    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}
