import Cookies from 'js-cookie'

export async function verifyToken() {
  const accessToken = Cookies.get('accessToken')

  if (accessToken === null || accessToken === undefined) {
    console.log('Access token invalid, please login again')
    return false
  } else {
    console.log('ready to set to request login')
    await requestLogin(accessToken)
  }
}

//set access token as headers and fetch to endpoint to verify it
export async function requestLogin(accessToken) {
  const response = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    //check what error does the server return, to determine actions
    console.log('Server error / token invalide')
  } else {
    //token is okay, can redirect user to protected page
    console.log('successfully set headers')
  }
}
