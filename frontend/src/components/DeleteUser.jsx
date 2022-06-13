import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useLogStatus from '../Context'

function DeleteUser() {
  const { dispatchLogout } = useLogStatus()
  const navigate = useNavigate()

  //2 seconds after landed on this page, user will be logged out and redirect to home page
  useEffect(() => {
    setTimeout(() => {
      Cookies.remove('accessToken')
      dispatchLogout()
      navigate('/')
    }, 2000)
  }, [])

  return (
    <>
      <h1>On est triste de vous voir partir</h1>
      <p>Ce page sera re-diregé à la page d'acceuil</p>
    </>
  )
}

export default DeleteUser
