import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useLogStatus from '../Context'

function DeleteUser() {
  const { dispatchLogout } = useLogStatus()
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      Cookies.remove('accessToken')
      dispatchLogout()
      navigate('/')
    }, 2000)
  }, [])

  return (
    <>
      <h1>this is delete page</h1>
    </>
  )
}

export default DeleteUser
