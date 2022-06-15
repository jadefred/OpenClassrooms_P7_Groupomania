import React, { useState, useEffect } from 'react'
import useLogStatus from '../Context'
import thumbOrange from '../assets/thumbUp-orange.svg'
import thumbgray from '../assets/thumbUp-gray.svg'

function LikePost({ likeUserId, postId, setClickLike }) {
  const { userId, token } = useLogStatus()
  const [liked, setLiked] = useState(false)

  //useEffect to get initial value to see whether user has already liked this post
  useEffect(() => {
    setLiked(likeUserId.some((i) => i === userId))
  }, [])

  async function likePost(userId, likeUserId, setClickLike) {
    //use some to determine if the user has already liked this post
    //send 0 if he already liked -> retrieve the like
    //send 1 if he hasn't react to the post
    const userliked = likeUserId.some((i) => i === userId) ? 0 : 1
    setLiked((prev) => !prev)
    //props from Feed, change state when user clicked like button to trigger useEffect to re-render all post in Feed
    setClickLike((prev) => !prev)
    const response = await fetch('http://localhost:3000/api/posts/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, postId, like: userliked }),
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <button
        onClick={() => {
          likePost(userId, likeUserId, setClickLike)
        }}
        className={`flex mx-auto items-center gap-x-2 ${liked ? 'text-primaire' : 'text-tertiaire'}`}
      >
        {liked ? (
          <img src={thumbOrange} alt="icône de pouce" className="w-5 h-5" />
        ) : (
          <img src={thumbgray} alt="icône de pouce" className="w-5 h-5" />
        )}{' '}
        <p>J'aime</p>
      </button>
    </>
  )
}

export default LikePost
