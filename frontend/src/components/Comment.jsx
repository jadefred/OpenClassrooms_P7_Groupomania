import React, { useContext } from 'react'
import { UserContext } from '../Context'
import '../styles/comment.css'

function Comment(props) {
  const comment = [...props.comment]
  const { user } = useContext(UserContext)

  async function deleteComment(commentId) {
    const response = await fetch('http://localhost:3000/api/posts/comments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId }),
    })

    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      {comment.map((i) => {
        return (
          <div key={i.commentId} className="Comment--box">
            <div>
              <p>{i.username}</p>
              <img src={i.avatarUrl} alt={`l'avatar de ${i.username}`} />
            </div>
            <div>{i.commentBody}</div>
            {(user.userId === i.userId || user.admin) && (
              <button
                onClick={() => {
                  deleteComment(i.commentId)
                }}
              >
                Supprimer
              </button>
            )}
          </div>
        )
      })}
    </>
  )
}

export default Comment
