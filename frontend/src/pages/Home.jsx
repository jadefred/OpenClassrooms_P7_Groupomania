import React, { useState } from 'react'

//components
import HomeNavBar from '../components/HomeNavBar'

function Home() {
  const [guest, setGuest] = useState(true)
  return (
    <>
      <HomeNavBar guest={guest} setGuest={setGuest} />
      <div>
        <h1>Groupomania</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
          aperiam.
        </p>
      </div>
    </>
  )
}

export default Home
