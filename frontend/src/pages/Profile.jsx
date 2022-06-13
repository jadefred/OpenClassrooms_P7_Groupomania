import React, { useState } from 'react'
import useFlashMessage from '../hooks/useFlashMessage'

//components
import NavBar from '../components/NavBar.jsx'
import UserProfile from '../components/UserProfile.jsx'
import FlashMessage from '../components/FlashMessage'
import DeleteUser from '../components/DeleteUser.jsx'

function Profile() {
  const { flashMessage, setFlashMessage, timeOutMessage } = useFlashMessage()
  const [deleteAccount, setDeleteAccount] = useState(false)

  return (
    <>
      <NavBar />
      {flashMessage !== '' && <FlashMessage flashMessage={flashMessage} />}

      {!deleteAccount ? (
        <UserProfile
          setFlashMessage={setFlashMessage}
          timeOutMessage={timeOutMessage}
          setDeleteAccount={setDeleteAccount}
        />
      ) : (
        <DeleteUser setDeleteAccount={setDeleteAccount} />
      )}
    </>
  )
}

export default Profile
