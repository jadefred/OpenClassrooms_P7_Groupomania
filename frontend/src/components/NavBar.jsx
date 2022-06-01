import React, { useContext } from 'react'
import '../styles/navBar.css'
import Context from '../Context'
import { useNavigate } from 'react-router'

function NavBar() {
  const { setLoggedin } = useContext(Context)
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('username')
    localStorage.removeItem('authentication')
    setLoggedin(false)
    navigate('/')
  }

  return (
    <>
      <div className="NavBar">
        <p>GROUPOMANIA</p>
        <div>
          <button>Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  )
}

export default NavBar
