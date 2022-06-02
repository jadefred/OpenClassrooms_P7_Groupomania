import React, { useState, useContext } from 'react'
import '../styles/signupFrom.css'
import { useNavigate } from 'react-router'
import { UserContext } from '../Context'

function SignupForm() {
  const [usernameValidate, setUsernameValidate] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)
  const [pwValidated, setPwValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [serverError, setServerError] = useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)

  //password error message
  const [eightChar, setEightChar] = useState(false)
  const [uppercase, setUppercase] = useState(false)
  const [lowercase, setLowercase] = useState(false)
  const [number, setNumber] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(true)

  function verifyUsername(e) {
    //username can containe only uppercase, lowercase letter, number and underscore, between 3 & 20 characters
    const regexUsername = /[\w]{3,20}$/
    if (regexUsername.test(e.target.value)) {
      setUsernameValidate(true)
    } else {
      setUsernameValidate(false)
    }
  }

  function verifyEmail(e) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (emailPattern.test(e.target.value)) {
      setEmailValidated(true)
    } else {
      setEmailValidated(false)
    }
  }

  function verifyPassword(e) {
    //password must contain 8 characters
    const regexLength = /^\w{8,}$/
    if (regexLength.test(e.target.value)) {
      setEightChar(true)
    } else {
      setEightChar(false)
    }

    //password contains 1 uppercase
    const regexUppercase = /[A-Z]/
    if (regexUppercase.test(e.target.value)) {
      setUppercase(true)
    } else {
      setUppercase(false)
    }

    //password contains 1 lowercase
    const regexLowercase = /[a-z]/
    if (regexLowercase.test(e.target.value)) {
      setLowercase(true)
    } else {
      setLowercase(false)
    }

    //password contains 1 number
    const regexNumber = /[\d]/
    if (regexNumber.test(e.target.value)) {
      setNumber(true)
    } else {
      setNumber(false)
    }

    //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    if (regexPassword.test(e.target.value)) {
      setPwValidated(true)
    } else {
      setPwValidated(false)
    }
  }

  function handleSignup(e) {
    e.preventDefault()
    if (
      usernameValidate &&
      emailValidated &&
      pwValidated &&
      e.target.signupPassword.value === e.target.signupConfirmPassword.value
    ) {
      //object of signup info
      const signupInfo = {
        username: e.target.signupUsername.value,
        email: e.target.signupEmail.value,
        password: e.target.signupPassword.value,
      }

      //Prepare post object - signup
      const signupForm = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupInfo),
      }

      //async POST data to server
      async function signup() {
        try {
          const response = await fetch(
            'http://localhost:3000/api/auth/signup',
            signupForm
          )
          //res not ok, throw error
          if (!response.ok) {
            throw Error('Signup failed')
          }
          console.log('signup successfully')
        } catch (err) {
          //catch block, console error and show server error message
          console.log(err)
          setServerError(true)
        }
      }

      //auto signup after sucessfully signed up
      //object of login info
      const loginInfo = {
        email: e.target.signupEmail.value,
        password: e.target.signupPassword.value,
      }

      //Prepare post object - login
      const loginForm = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      }

      //async POST data to server
      async function login() {
        try {
          const response = await fetch(
            'http://localhost:3000/api/auth/login',
            loginForm
          )
          //res not ok, throw error
          if (!response.ok) {
            throw Error('Login Failed')
          }

          //res ok, save token and username, then redirect to feed
          const data = await response.json()
          localStorage.setItem('username', data.username)
          localStorage.setItem('authentication', data.token)
          setUser((prev) => ({ userId: data._id, auth: true }))
          navigate('/feed')
        } catch (err) {
          //catch block, console error and display error message
          console.log(err)
          setUser((prev) => ({ userId: '', auth: false }))
        }
      }

      signup()
      login()
      setErrorMessage(false)
    }
    //see if passwords are match, update state to pop error msg
    else {
      if (
        e.target.signupPassword.value !== e.target.signupConfirmPassword.value
      ) {
        setConfirmPassword(false)
      } else {
        setConfirmPassword(true)
      }
      setErrorMessage(true)
    }
  }

  return (
    <>
      {serverError && <p>Server Error, please try again later</p>}
      <div className="signupForm">
        <form onSubmit={handleSignup}>
          <input
            onChange={verifyUsername}
            type="text"
            name="signupUsername"
            placeholder="username"
            required
          />
          {errorMessage && !usernameValidate && (
            <p>
              Username must between 3 to 20 characters, only letters, numbers
              and underscore is allowed
            </p>
          )}
          <input
            onChange={verifyEmail}
            type="email"
            name="signupEmail"
            placeholder="email@email.com"
            required
          />
          {errorMessage && !emailValidated && <p>Email format is incorrect</p>}
          <input
            onChange={verifyPassword}
            type="password"
            name="signupPassword"
            placeholder="password"
            style={pwValidated ? { color: 'green' } : { color: 'red' }}
            required
          />
          <p style={eightChar ? { color: 'green' } : { color: 'red' }}>
            Password must contain 8 characters
          </p>
          <p style={uppercase ? { color: 'green' } : { color: 'red' }}>
            Password must contain 1 uppercase
          </p>
          <p style={lowercase ? { color: 'green' } : { color: 'red' }}>
            Password must contain 1 lowercase
          </p>
          <p style={number ? { color: 'green' } : { color: 'red' }}>
            Password must contain 1 number
          </p>
          <input
            type="password"
            name="signupConfirmPassword"
            placeholder="confirm password"
            required
          />
          {errorMessage && !confirmPassword && <p>Passwords are not match</p>}
          <input type="submit" value="SIGNUP" />
        </form>
      </div>
    </>
  )
}

export default SignupForm
