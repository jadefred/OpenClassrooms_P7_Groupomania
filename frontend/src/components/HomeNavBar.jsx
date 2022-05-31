import React from 'react'
import '../styles/homeNavBar.css'

function HomeNavBar({ guest, setGuest }) {
  return (
    <>
      <div className="HomeNavBar">
        <button
          onClick={() => {
            setGuest(true)
          }}
        >
          Signup
        </button>
        <button
          onClick={() => {
            setGuest(false)
          }}
        >
          Login
        </button>
      </div>
    </>
  )
}

export default HomeNavBar
