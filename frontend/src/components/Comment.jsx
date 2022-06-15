import React from 'react'
import '../styles/comment.css'
import useLogStatus from '../Context'
import deleteBtn from '../assets/deleteBtn.svg'

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
          <div key={i.commentId} className="flex px-4">
            {/* Username, avatar block */}
            <div className="flex items-center gap-x-3 basis-1/4">
              <img
                src={i.avatarUrl}
                alt={`l'avatar de ${i.username}`}
                className="w-8 h-8 object-cover rounded-full"
              />
              <p>{i.username}</p>
            </div>
            <div className="flex justify-between items-center basis-3/4 gap-x-2">
              <div className="basis-3/4">{i.commentBody}</div>
              {(userId === i.userId || admin) && (
                <button
                  onClick={() => {
                    deleteComment(i.commentId)
                  }}
                  className="basis-1/4 text-right"
                >
                  <img
                    src={deleteBtn}
                    alt="supprimer cette commentaire"
                    className="w-5 h-5"
                  />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Comment
