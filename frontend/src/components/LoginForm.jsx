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

  //Check if access token exist, if so pass to requestLogin function, if not return
  async function verifyToken() {
    const accessToken = Cookies.get('accessToken')

    if (accessToken === null || accessToken === undefined) {
      console.log('Access token invalid, please login again')
      return false
    } else {
      await requestLogin(accessToken)
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
        const { accessToken } = data
        Cookies.set('accessToken', accessToken)
        //Cookies.set('refreshToken', refreshToken)
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
