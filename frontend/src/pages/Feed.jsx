import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import '../styles/feed.css'

function Feed() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allPosts, setAllPosts] = useState([])

  //fetch to get all post
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

  function likePost(postId, userId) {
    console.log(postId)
  }

  return (
    <>
      <NavBar />
      <div className="Feed">
        {isLoaded && error && <p>Something went wrong...</p>}

        {isLoaded && !error && (
          <div className="Feed__all-posts-wrapper">
            {/* map throught allPosts state to display all content */}
            {allPosts.map((post) => {
              return (
                <div key={post._id} className="Feed__one-post-wrapper">
                  <div>
                    <h2>{post.title}</h2>
                  </div>
                  <div>
                    <p>{post.content}</p>
                    {/* appear only when imageUrl is added */}
                    {post.imageUrl !== '' && (
                      <img
                        style={{ width: '100px' }}
                        src={post.imageUrl}
                        alt={post.title}
                      />
                    )}
                  </div>
                  <div className="Feed__one-post--like-comment-box">
                    {/* number of people liked this post, hide p whee like is 0 */}
                    {post.like > 0 && post.like <= 1 && <p>{post.like} Like</p>}
                    {post.like > 1 && <p>{post.like} Likes</p>}

                    {/* number of comment on this post, hide p when no comment */}
                    {post.totalComment > 0 && post.totalComment <= 1 && (
                      <p>{post.totalComment} Commentaire</p>
                    )}
                    {post.totalComment > 1 && (
                      <p>{post.totalComment} Commentaires</p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        likePost(post._id)
                      }}
                    >
                      J'aime
                    </button>
                    <button>Commenter</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Feed
