import React from 'react'

function HomeNavBar({ setGuest }) {
  return (
    <>
      <div className="flex md:justify-end justify-center gap-x-10 px-7 py-4 border-b-2 border-primaire bg-red-50 ">
        <button
          onClick={() => {
            setGuest(true)
          }}
          className="text-white font-semibold bg-primaire px-4 py-2 rounded-md"
        >
          S'INSCRIRE
        </button>
        <button
          onClick={() => {
            setGuest(false)
          }}
          className="text-white font-semibold bg-tertiaire px-4 py-2 rounded-md"
        >
          SE CONNECTER
        </button>
      </div>
    </>
  )
}

export default HomeNavBar
