import React from 'react'
import useLogStatus from '../Context'

function LikePost({ likeUserId, postId }) {
  const { userId, token } = useLogStatus()

  async function likePost(userId, likeUserId) {
    //use some to determine if the user has already liked this post
    //send 0 if he already liked -> retrieve the like
    //send 1 if he hasn't react to the post
    const userliked = likeUserId.some((i) => i === userId) ? 0 : 1
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
          likePost(userId, likeUserId)
        }}
      >
        J'aime
      </button>
    </>
  )
}

export default LikePost
