import React, { useState } from 'react'

function SignupForm() {
  const [usernameValidate, setUsernameValidate] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)
  const [pwValidated, setPwValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

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
      console.log('yay! new account')
      setErrorMessage(false)
    } else {
      //see if passwords are match, update state to pop error msg
      if (
        e.target.signupPassword.value !== e.target.signupConfirmPassword.value
      ) {
        setConfirmPassword(false)
      } else {
        setConfirmPassword(true)
      }
      console.log('infomation not completed')
      setErrorMessage(true)
    }
  }

  return (
    <>
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
          <input type="password" name="signupConfirmPassword" required />
          {errorMessage && !confirmPassword && <p>Passwords are not match</p>}
          <input type="submit" value="SIGNUP" />
        </form>
      </div>
    </>
  )
}

export default SignupForm
