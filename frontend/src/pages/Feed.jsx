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

  console.log(allPosts)
  return (
    <>
      <NavBar />
      {isLoaded && error && <p>Something went wrong...</p>}

      {isLoaded && !error && (
        <div>
          {allPosts.map((post) => {
            return (
              <div key={post._id}>
                <div>
                  <h2>{post.title}</h2>
                </div>
                <div>
                  <p>{post.content}</p>
                  {post.imageUrl !== '' && (
                    <img
                      style={{ width: '100px' }}
                      src={post.imageUrl}
                      alt={post.title}
                    />
                  )}
                </div>
                <div>
                  <p>{post.like} Likes</p>
                  {post.totalComment <= 1 && <p>{post.totalComment} Comment</p>}
                  {post.totalComment > 1 && <p>{post.totalComment} Comments</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Feed
