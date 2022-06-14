import React, { useState } from 'react'

//components
import HomeNavBar from '../components/HomeNavBar'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import logoOrange from '../assets/logo-orange.svg'

function Home() {
  const [guest, setGuest] = useState(false)
  return (
    <>
      <HomeNavBar setGuest={setGuest} />
      <div className="flex px-24 gap-x-20 mt-40">
        <div className="basis-1/2">
          <img src={logoOrange} alt="Logo de groupomania" className="w-8/12" />
          <h1 className="text-4xl font-bold text-tertiaire mt-10">
            Partagez et restez en contact avec vos colleagues.
          </h1>
        </div>
        <div className="basis-1/2">
          {guest ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </>
  )
}

export default Home
