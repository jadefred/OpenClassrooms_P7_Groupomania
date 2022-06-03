import React, { useContext } from 'react'
import '../styles/navBar.css'
import { UserContext } from '../Context'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'

function NavBar() {
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  function logout() {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    setUser((prev) => ({ userId: '', auth: false, token: '' }))
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
