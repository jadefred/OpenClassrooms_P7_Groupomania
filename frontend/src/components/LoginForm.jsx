import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { verifyToken } from '../Utils.jsx'
import '../styles/loginForm.css'
import useLogStatus from '../Context'

function LoginForm() {
  const email = useRef()
  const password = useRef()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { dispatchLogin, dispatchLogout } = useLogStatus()

  function handleLogin(e) {
    e.preventDefault()

    //object for POST request
    const userInfo = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
    }

    login()

    //async POST request - Login
    async function login() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/login',
          userInfo
        )

        //response not ok, throw error, depends on status code
        if (!response.ok) {
          if (response.status === 500) {
            setError("L'erreur du serveur, veuillez réessayer plus tard.")
            throw Error('server error')
          }
          if (response.status === 401) {
            setError("L'adresse mail ou le mot de passe est incorrecte.")
            throw Error('incorrect email or password')
          }
        }

        const data = await response.json()
        //set access token as cookie once received data
        const { accessToken } = data
        Cookies.set('accessToken', accessToken, { expires: 1 })

        //verify token (function from utils), return false if it is not validate
        const tokenValid = await verifyToken()
        if (tokenValid === false) {
          setError("L'authentification est expirée, veuillez reconnecter.")
          throw Error('Access token invalid')
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
        console.log(err.message)
        //setError(true)
        dispatchLogout()
      }
    }
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
          {error && <p>{error}</p>}
          <input type="submit" value="SE CONNECTER" />
        </form>
      </div>
    </>
  )
}

export default LoginForm
