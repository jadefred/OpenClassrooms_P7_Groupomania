import React, { useEffect } from 'react'
import useFetch from '../hooks/useFetch'

function UserProfile() {
  const { data, loading, error } = useFetch(
    'http://localhost:3000/api/posts',
    'GET'
  )

  console.log(data)

  return <></>
}

export default UserProfile
