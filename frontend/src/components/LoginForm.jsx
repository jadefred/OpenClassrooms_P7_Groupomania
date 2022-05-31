import React, { useRef } from 'react'

function LoginForm() {
  const email = useRef()
  const password = useRef()

  function handleLogin(e) {
    e.preventDefault()
    console.log(email.current.value)
    console.log(password.current.value)
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
