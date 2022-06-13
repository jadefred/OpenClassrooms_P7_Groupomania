import React from 'react'
import '../styles/homeNavBar.css'

function HomeNavBar({ setGuest }) {
  return (
    <>
      <div className="HomeNavBar">
        <button
          onClick={() => {
            setGuest(true)
          }}
        >
          S'INSCRIRE
        </button>
        <button
          onClick={() => {
            setGuest(false)
          }}
        >
          SE CONNECTER
        </button>
      </div>
    </>
  )
}

export default HomeNavBar
