import React, { useState } from 'react'
import '../styles/signupFrom.css'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { verifyToken } from '../Utils.jsx'
import useLogStatus from '../Context'

function SignupForm() {
  const { dispatchLogin, dispatchLogout } = useLogStatus()
  const [usernameValidate, setUsernameValidate] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)
  const [pwValidated, setPwValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  //password error message
  const [eightChar, setEightChar] = useState(false)
  const [uppercase, setUppercase] = useState(false)
  const [lowercase, setLowercase] = useState(false)
  const [number, setNumber] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(true)

  //username can containe only uppercase, lowercase letter, number and underscore, between 3 & 30 characters
  function verifyUsername(e) {
    const regexUsername = /[\w]{3,30}$/
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

    //Check if all input values are good
    if (
      usernameValidate &&
      emailValidated &&
      pwValidated &&
      e.target.signupPassword.value === e.target.signupConfirmPassword.value
    ) {
      //Signup info for POST - signup
      const signupForm = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: e.target.signupUsername.value,
          email: e.target.signupEmail.value,
          password: e.target.signupPassword.value,
        }),
      }

      //async POST request to server to create account
      async function signup() {
        try {
          const response = await fetch(
            'http://localhost:3000/api/auth/signup',
            signupForm
          )
          //response not okay, throw error and display error message
          if (!response.ok) {
            if (response.status === 409) {
              setError('Cette adresse mail est déjà enregistrée.')
              throw Error('server error')
            }
            setError('Une erreur est apparue, veuillez réessayer plus tard')
            throw Error('server error')
          }

          //auto signup after sucessfully signed up
          console.log('signup successfully')
          login()
        } catch (err) {
          console.log(err)
        }
      }

      //Object for login POST request
      const loginForm = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: e.target.signupEmail.value,
          password: e.target.signupPassword.value,
        }),
      }

      //async POST data to server
      async function login() {
        try {
          const response = await fetch(
            'http://localhost:3000/api/auth/login',
            loginForm
          )
          //response not okay, throw error and display error message
          if (!response.ok) {
            if (response.status === 500) {
              setError("L'erreur du serveur, veuillez se connecter plus tard.")
              throw Error('server error - cannot login')
            }
            setError('Une erreur est apparue, veuillez se connecter plus tard.')
            throw Error('Login error')
          }

          const data = await response.json()
          //set access token as cookie once received data
          const { accessToken } = data
          Cookies.set('accessToken', accessToken, { expires: 1 })

          //verify token (function from utils), return false if it is not validate
          const tokenValid = await verifyToken()
          if (tokenValid === false) {
            setError("L'authentification est expirée, veuillez se reconnecter.")
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
          console.log(err)
          dispatchLogout()
        }
      }

      signup()
      setErrorMessage(false)
    }
    //pop error message if password is not matched
    //setErrorMessage set as true, the input field which are not correct will prompt error message accordingly
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
      {error !== '' && <p>{error}</p>}
      <div className="signupForm">
        <form onSubmit={handleSignup}>
          <input
            onChange={verifyUsername}
            type="text"
            name="signupUsername"
            placeholder="Pseudo"
            required
          />
          {errorMessage && !usernameValidate && (
            <p>
              Le pseudo doit contenir entre 3 et 30 caractères <br />
              Utiliser uniquement des lettres minuscules, majuscules, nombres et
              tiret du bas
            </p>
          )}
          <input
            onChange={verifyEmail}
            type="email"
            name="signupEmail"
            placeholder="Email"
            required
          />
          {errorMessage && !emailValidated && (
            <p>Le format de l'adresse mail est invalide</p>
          )}
          <input
            onChange={verifyPassword}
            type="password"
            name="signupPassword"
            placeholder="Mot de passe"
            style={pwValidated ? { color: 'green' } : { color: 'red' }}
            required
          />
          <p>Votre mot de passe doit contenir au moins : </p>
          <p style={eightChar ? { color: 'green' } : { color: 'red' }}>
            8 caractères
          </p>
          <p style={uppercase ? { color: 'green' } : { color: 'red' }}>
            1 majuscule
          </p>
          <p style={lowercase ? { color: 'green' } : { color: 'red' }}>
            1 minuscule
          </p>
          <p style={number ? { color: 'green' } : { color: 'red' }}>1 nombre</p>
          <input
            type="password"
            name="signupConfirmPassword"
            placeholder="Confirmer le mot de passe"
            required
          />
          {errorMessage && !confirmPassword && (
            <p>Veuillez saisir le même mot de passe</p>
          )}
          <input type="submit" value="S'INSCRIRE" />
        </form>
      </div>
    </>
  )
}

export default SignupForm
