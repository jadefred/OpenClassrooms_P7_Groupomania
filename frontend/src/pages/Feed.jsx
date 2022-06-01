import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'

function Feed() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allPosts, setAllPosts] = useState([])

  useEffect(() => {
    async function getAllPosts() {
      const response = await fetch('http://localhost:3000/api/posts')
      if (response.status !== 200) {
        setError(true)
      }
      const data = await response.json()
      setAllPosts(data)
      setIsLoaded(true)
    }

    getAllPosts()
  }, [])
  return (
    <>
      <NavBar />
      {isLoaded && error && <p>Something went wrong...</p>}
      {isLoaded && !error && <h1>This is feed</h1>}
    </>
  )
}

export default Feed
