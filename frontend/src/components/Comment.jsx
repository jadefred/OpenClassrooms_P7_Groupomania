import React from 'react'
import '../styles/comment.css'
import useLogStatus from '../Context'

function Comment(props) {
  const comment = [...props.comment]
  //const { user } = useContext(UserContext)
  const { userId, token, admin } = useLogStatus()

  async function deleteComment(commentId) {
    const response = await fetch('http://localhost:3000/api/posts/comments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
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
            {(userId === i.userId || admin) && (
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
