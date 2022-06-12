import React from 'react'
import '../styles/navBar.css'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import useLogStatus from '../Context'

function NavBar() {
  const { dispatchLogout } = useLogStatus()
  const navigate = useNavigate()

  function toLogout() {
    Cookies.remove('accessToken')
    dispatchLogout()
    navigate('/')
  }

  return (
    <>
      <div className="NavBar">
        <Link to="/feed">
          <p>GROUPOMANIA</p>
        </Link>
        <div>
          <Link to="/profile">
            <button>Profile</button>
          </Link>
          <button onClick={toLogout}>Logout</button>
        </div>
      </div>
    </>
  )
}

export default NavBar
