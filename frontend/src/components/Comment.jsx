import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import useLogStatus from '../Context';
import deleteBtn from '../assets/deleteBtn.svg';
import defaultProfil from '../assets/defaultProfil.svg';
import loader from '../assets/loadingSpinner-gray.svg';
//import useFetch from '../hooks/useFetch';

function Comment({
  postId,
  setFlashMessage,
  feedSetRefresh,
  newComment,
  setNewComment,
}) {
  const { userId, token, admin } = useLogStatus();
  // const { data, isLoaded, error, setRefresh } = useFetch(
  //   `http://localhost:3000/api/posts/comments/${postId}`
  // );

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(null);

  console.count('Comment :');
  console.log('Comment - data ', data);

  useEffect(() => {
    async function getComment() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/posts/comments/${postId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
          }
        );
        const fetchData = await response.json();

        setData(fetchData);
        setIsLoaded(true);
      } catch (error) {
        setError(true);
        setIsLoaded(true);
      }
    }
    getComment();
  }, [postId, refresh]);

  //CommentButton component set newComment state as true when user left a comment.
  //useEffect will be triggered and refresh comment in order to display all the latest comments
  useEffect(() => {
    if (newComment) {
      setRefresh((prev) => !prev);
      setNewComment(false);
    }
  }, [newComment, setRefresh, setNewComment]);

  async function deleteComment(commentId, userId, postId) {
    const response = await fetch('http://localhost:3000/api/posts/comments', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId, userId, postId }),
    });

    //flash success message if res is ok, then reset state to make it disappear
    if (response.ok) {
      setFlashMessage('Vous avez supprimé un commentaire');
      setRefresh((prev) => !prev);
      feedSetRefresh((prev) => !prev);
    }
    //fail flash message
    else {
      setFlashMessage('Un problème a apparu..');
    }
  }

  return (
    <>
      {/* Fetch error handling */}
      {isLoaded && error && (
        <div className="bg-gray-200 py-6 flex flex-col gap-y-4 rounded-b-xl">
          <p className="text-center">
            Un problème a apparu, veuillez réessayer plus tard
          </p>
        </div>
      )}

      {/* isLoaded is false */}
      {!isLoaded && (
        <div className="bg-gray-200 py-6 flex flex-col gap-y-4 rounded-b-xl">
          <img
            src={loader}
            alt="chargement"
            className="animate-spin w-10 h-10 mx-auto"
          />
        </div>
      )}

      {/* Display all comments */}
      {isLoaded && data?.length && (
        <div className="bg-gray-200 py-6 flex flex-col gap-y-4 rounded-b-xl w-full">
          {isLoaded &&
            data?.length &&
            data.map((i) => {
              return (
                <div
                  key={i.comment_id}
                  className="flex bg-white w-4/5 mx-auto py-2 px-3 md:px-6 rounded-2xl gap-x-2"
                >
                  {/* Username, avatar block */}
                  <div className="flex items-center gap-x-1 md:gap-x-3 w-4/12">
                    {i.avatar_url ? (
                      <img
                        src={i.avatar_url}
                        alt={`l'avatar de ${i.username}`}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    ) : (
                      <img
                        src={defaultProfil}
                        alt="l'avatar d'utilisateur"
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    )}
                    <p className="font-semibold">{i.username}</p>
                  </div>

                  {/* body of comment and delete button */}
                  <div className="relative flex justify-between items-center mt-4 w-8/12">
                    <div className="flex flex-col w-10/12">
                      {i.commentbody && (
                        <div className="mb-4 break-words">{i.commentbody}</div>
                      )}

                      {i.imageurl && (
                        <img
                          src={i.imageurl}
                          alt={`Commentaire de ${i.username}`}
                          className="w-full object-cover rounded-xl mb-4"
                        />
                      )}
                    </div>
                    {(userId === i.user_id || admin) && (
                      <button
                        onClick={() => {
                          deleteComment(i.comment_id, userId, postId);
                        }}
                        className="absolute top-0 right-0"
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
      )}
    </>
  );
}

export default Comment;
