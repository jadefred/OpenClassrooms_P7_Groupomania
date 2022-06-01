import React, { useContext } from 'react'
import '../styles/navBar.css'
import Context from '../Context'
import { useNavigate, Link } from 'react-router-dom'

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
        <Link to="/feed">
          <p>GROUPOMANIA</p>
        </Link>
        <div>
          <button>Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  )
}

export default NavBar
