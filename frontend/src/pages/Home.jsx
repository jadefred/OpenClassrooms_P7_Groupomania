import React, { useState } from 'react'
import '../styles/home.css'

//components
import HomeNavBar from '../components/HomeNavBar'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

function Home() {
  const [guest, setGuest] = useState(false)
  return (
    <>
      <HomeNavBar guest={guest} setGuest={setGuest} />
      <div className="home__wrapper">
        <div className="home--logo">
          <h1>Groupomania</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
            aperiam.
          </p>
        </div>
        <div className="home--forms">
          {guest ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </>
  )
}

export default Home
