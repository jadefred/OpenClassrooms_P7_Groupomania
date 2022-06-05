import React from 'react'
import '../styles/comment.css'

function Comment(props) {
  const comment = [...props.comment]

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
            <button>Supprimer</button>
          </div>
        )
      })}
    </>
  )
}

export default Comment
