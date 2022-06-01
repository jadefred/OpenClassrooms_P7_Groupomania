import React, { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import '../styles/loginForm.css'
import Context from '../Context'

function LoginForm() {
  const email = useRef()
  const password = useRef()
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { setLoggedin } = useContext(Context)

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
          throw Error('testing error login')
        }

        //res ok, save token and username, then redirect to feed
        const data = await response.json()
        localStorage.setItem('username', data.username)
        localStorage.setItem('authentication', data.token)
        setLoggedin(true)
        navigate('/feed')
      } catch (err) {
        //catch block, console error and display error message
        console.log(err)
        setError(true)
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
