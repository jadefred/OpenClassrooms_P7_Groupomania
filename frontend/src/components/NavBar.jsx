import React from 'react'
import '../styles/navBar.css'

function NavBar() {
  return (
    <>
      <div className='NavBar'>
        <p>GROUPOMANIA</p>
        <div>
          <button>Profile</button>
          <button>Signout</button>
        </div>
      </div>
    </>
  )
}

export default NavBar
