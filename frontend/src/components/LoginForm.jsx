import React, { useRef } from 'react'

function LoginForm() {
  const email = useRef()
  const password = useRef()

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
        const response = await fetch('http://localhost:3000/login', options)
        const data = await response.json()
        console.log('this is after POST : ' + data)
      } catch (e) {
        console.log(e)
      }
    }

    login()
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          ref={email}
          type="email"
          name="loginEmail"
          placeholder="email@email.com"
          required
        />
        <input ref={password} type="password" name="loginPassword" required />
        <input type="submit" value="LOGIN" />
      </form>
    </>
  )
}

export default LoginForm
