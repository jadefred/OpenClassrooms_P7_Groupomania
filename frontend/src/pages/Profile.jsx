import React from 'react'
import useFlashMessage from '../hooks/useFlashMessage'

//components
import NavBar from '../components/NavBar.jsx'
import UserProfile from '../components/UserProfile.jsx'
import FlashMessage from '../components/FlashMessage'

function Profile() {
  const { flashMessage, setFlashMessage, timeOutMessage } = useFlashMessage()

  return (
    <>
      <NavBar />
      {flashMessage !== '' && <FlashMessage flashMessage={flashMessage} />}
      <UserProfile setFlashMessage={setFlashMessage} timeOutMessage={timeOutMessage}/>
    </>
  )
}

export default Profile
