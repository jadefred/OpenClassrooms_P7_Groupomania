import React, { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import '../styles/loginForm.css'
import { UserContext } from '../Context'
import Cookies from 'js-cookie'

function LoginForm() {
  const email = useRef()
  const password = useRef()
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  async function verifyToken() {
    const accessToken = Cookies.get('accessToken')
    const refreshToken = Cookies.get('refreshToken')

    //validate both token
    const checkToken = await hasAccess(accessToken, refreshToken)

    if (checkToken === null) {
      //user has no refresh token, send result as false
      console.log('protect function failed, need to re-login')
      return false
    } else {
      const updatedAccessToken = Cookies.get('accessToken')
      const updatedRefreshToken = Cookies.get('refreshToken')
      //token is valid, send both value to continue login  process
      console.log('redirecting to request login function')
      await requestLogin(updatedAccessToken, updatedRefreshToken)
    }
  }

  async function hasAccess(accessToken, refreshToken) {
    //if no refresh token, return null
    if (refreshToken === 'null' || refreshToken === 'undefined') {
      console.log('enter to return null')
      return null
    }

    //if access token is undefined, use refresh token to request a new access token from server, then return it
    if (accessToken === 'undefined' || accessToken === 'null') {
      await refresh(refreshToken)
      accessToken = Cookies.get('accessToken')
      return accessToken
    }

    //else, just return origin access token
    return accessToken
  }

  async function refresh(refreshToken) {
    //use refresh token which sent by the function hasAccess to request a new access token from server
    console.log('refreshing token')

    //this api will verify if the refresh token is valid, if so, the serve will send a new access token as response
    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    //if server reject its action, ask user to re-login
    if (!response.ok) {
      //pop error msg to remind re-login
      console.log('refresh token not valid')
    }
    const data = await response.json()
    //set new access token as cookie if ok
    const { accessToken } = data
    Cookies.set('accessToken', accessToken)
    console.log('updated token')
  }

  async function requestLogin(accessToken, refreshToken) {
    //send access token to api and set it as headers
    const response = await fetch('http://localhost:3000/api/auth/protected', {
      method: 'POST',
      headers: { authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      //should have 2 possibilities
      //either access token is not authorized -> ask to re-login
      //either access token is expired -> use refresh function, sent refresh token to generate a new access token again
    } else {
      //token is okay, can redirect user to protected page
      console.log('successfully set headers')
    }
  }

  function handleLogin(e) {
    e.preventDefault()

    //user login ready to be stringify
    const userInfo = {
      email: email.current.value,
      password: password.current.value,
    }

    //Prepare post object
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    }

    //async POST data to server
    async function login() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/login',
          options
        )
        //res not ok, throw error
        if (!response.ok) {
          throw Error('Login Failed')
        }

        const data = await response.json()
        const { accessToken, refreshToken } = data
        Cookies.set('accessToken', accessToken)
        Cookies.set('refreshToken', refreshToken)
        localStorage.setItem('username', data.username)
        localStorage.setItem('userId', data._id)

        //verify token, return false if it is not validate
        const tokenValid = await verifyToken()
        if (tokenValid === false) {
          throw Error('failed to login')
        }

        //update context
        setUser((prev) => ({
          userId: data._id,
          username: data.username,
          auth: true,
          token: accessToken,
          admin: data.admin,
        }))
        navigate('/feed')
      } catch (err) {
        //catch block, console error and display error message
        console.log(err)
        setError(true)
        setUser((prev) => ({
          userId: '',
          username: '',
          auth: false,
          token: '',
          admin: false,
        }))
      }
    }

    login()
  }

  return (
    <>
      <div className="loginForm">
        <form onSubmit={handleLogin}>
          <input
            ref={email}
            type="email"
            name="loginEmail"
            placeholder="email@email.com"
            required
          />
          <input ref={password} type="password" name="loginPassword" required />
          {error && <p>wrong email or wrong password</p>}
          <input type="submit" value="LOGIN" />
        </form>
      </div>
    </>
  )
}

export default LoginForm
