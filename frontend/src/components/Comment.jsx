import React from 'react';
import useLogStatus from '../Context';
import deleteBtn from '../assets/deleteBtn.svg';
import useFetch from '../hooks/useFetch';

function Comment({ postId }) {
  //const comment = [...props.comment];
  const { userId, token, admin } = useLogStatus();
  const { data, isLoaded, error } = useFetch(
    `http://localhost:3000/api/posts/comments/${postId}`
  );

  console.log(data);

  async function deleteComment(commentId) {
    const response = await fetch('http://localhost:3000/api/posts/comments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="bg-gray-200 py-6 flex flex-col gap-y-4 rounded-b-xl">
      {isLoaded &&
        data &&
        data.map((i) => {
          return (
            <div
              key={i.comment_id}
              className="flex bg-white w-4/5 mx-auto py-2 px-6 rounded-2xl"
            >
              {/* Username, avatar block */}
              <div className="flex items-center gap-x-3 basis-1/4">
                <img
                  src={i.avatar_url}
                  alt={`l'avatar de ${i.username}`}
                  className="w-8 h-8 object-cover rounded-full"
                />
                <p className="font-semibold">{i.username}</p>
              </div>
              <div className="flex justify-between items-center basis-3/4 gap-x-2 mt-4">
                <div className="flex flex-col basis-3/4">
                  {i.commentbody && <div className="mb-4">{i.commentbody}</div>}

                  {i.imageurl && (
                    <img
                      src={i.imageurl}
                      alt={`Commentaire de ${i.username}`}
                      className="w-full object-cover rounded-xl mb-4"
                    />
                  )}
                </div>
                {(userId === i.userId || admin) && (
                  <button
                    onClick={() => {
                      deleteComment(i.comment_id);
                    }}
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
          );
        })}
    </div>
  );
}

export default Comment;
