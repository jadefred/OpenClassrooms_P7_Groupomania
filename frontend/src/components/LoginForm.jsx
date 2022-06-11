import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { verifyToken } from '../Utils.jsx'
import '../styles/loginForm.css'
import useLogStatus from '../Context'

function LoginForm() {
  const email = useRef()
  const password = useRef()
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { dispatchLogin, dispatchLogout } = useLogStatus()

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
        //set access token as cookie once received data
        const { accessToken } = data
        Cookies.set('accessToken', accessToken, { expires: 1 })

        //verify token (function from utils), return false if it is not validate
        const tokenValid = await verifyToken()
        if (tokenValid === false) {
          throw Error('failed to login')
        }

        //object for useLogStatus hook
        const loginInfo = {
          userId: data._id,
          username: data.username,
          auth: true,
          token: accessToken,
          admin: data.admin,
          avatarUrl: data.avatarUrl,
        }
        
        dispatchLogin(loginInfo)

        //redirect to feed page
        navigate('/feed')
      } catch (err) {
        //catch block, console error and display error message
        console.log(err)
        setError(true)
        dispatchLogout()
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
