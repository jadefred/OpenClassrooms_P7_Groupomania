import React, { useState, useEffect } from 'react';
import useFlashMessage from '../hooks/useFlashMessage';
import useLogStatus from '../Context';
import editPostLogo from '../assets/editPost.svg';
import defaultProfil from '../assets/defaultProfil.svg';
import useFetch from '../hooks/useFetch';

//components
import { MemoizedNavBar } from '../components/NavBar.jsx';
import Comment from '../components/Comment.jsx';
import { MemoizedNewPost } from '../components/NewPost.jsx';
import EditPost from '../components/EditPost.jsx';
import FlashMessage from '../components/FlashMessage';
import CommentButton from '../components/CommentButton';
import LikePost from '../components/LikePost';

function Feed() {
  const [showComment, setShowComment] = useState({});
  const [modal, setModal] = useState({});
  const { flashMessage, setFlashMessage } = useFlashMessage();
  const { userId, admin } = useLogStatus();
  const [noPostMsg, setNoPostMsg] = useState(false);
  const { data, isLoaded, error, setRefresh } = useFetch(
    'http://localhost:3000/api/posts'
  );

  console.log(data);

  //when data contains no post, show no post message
  useEffect(() => {
    if (data && data.length === 0) {
      setNoPostMsg(true);
    } else {
      setNoPostMsg(false);
    }
  }, [data]);

  //toggle comment block, map id key to target clicked element
  function toggleComment(id) {
    setShowComment((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    );
  }

  //toggle modal when clicked modifer post button
  function toggleModal(id) {
    setModal((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    );
  }

  return (
    <>
      <MemoizedNavBar />
      {isLoaded && !error && (
        <MemoizedNewPost
          setFlashMessage={setFlashMessage}
        />
      )}

      {/* flash message pops up after user edited a post */}
      {flashMessage !== '' && <FlashMessage flashMessage={flashMessage} />}

      <div className="w-11/12 md:w-8/12 mx-auto pb-14">
        {isLoaded && error && (
          <p className="text-tertiaire text-center text-4xl py-52">
            Un problème apparu, veuillez réessayer
          </p>
        )}

        {isLoaded && noPostMsg && (
          <p className="text-tertiaire text-center text-4xl py-52">
            Aucun post... Vous voulez créer un post ?
          </p>
        )}

        {isLoaded && !error && data && (
          <div className="w-full flex flex-col gap-y-10 text-tertiaire">
            {/* map throught allPosts state to display all content */}
            {data.map((post) => {
              return (
                <>
                  <div
                    key={post.post_id}
                    className="border-2 border-gray-500 rounded-xl"
                  >
                    <div>
                      {/* username, avatar and edit button block */}
                      <div className="flex justify-between px-3 py-1 text-white bg-lightGray rounded-t-md">
                        <div className="flex items-center gap-x-3">
                          <img
                            src={
                              post.avatar_url ? post.avatar_url : defaultProfil
                            }
                            alt={`l'avatar de ${post.username}`}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <p className="font-bold text-md">{post.username}</p>
                        </div>
                        {/* render edit button if user is op / admin  */}
                        {(post.user_id === userId || admin) && (
                          <button
                            onClick={() => {
                              toggleModal(post.post_id);
                            }}
                          >
                            <img
                              src={editPostLogo}
                              alt="bouton pour modifier le post"
                              className="w-5 h-5"
                            />
                          </button>
                        )}
                      </div>
                      <div>
                        {/* render edit post component when content according post_id */}
                        {modal[post.post_id] && (
                          <EditPost
                            post={post}
                            post_id={post.post_id}
                            modal={modal}
                            setModal={setModal}
                            setFlashMessage={setFlashMessage}
                            //timeOutMessage={timeOutMessage}
                          />
                        )}
                      </div>
                    </div>

                    {/* Block of title, content, like, comment buttons */}
                    <div>
                      <div className="flex flex-col gap-y-4 w-9/12 mx-auto my-3">
                        <h2 className="font-bold text-2xl">{post.title}</h2>
                        <p>{post.content}</p>
                        {/* appear only when imageUrl is added */}
                        {post.imageurl && (
                          <img
                            src={post.imageurl}
                            alt={post.title}
                            className="w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="w-full mt-5 mb-2">
                        <div className="w-9/12 flex mx-auto justify-end gap-x-8 ">
                          {/* number of people liked this post, hide p whee like is 0 */}
                          {post.likes > 0 && post.likes <= 1 && (
                            <p>{post.likes} Like</p>
                          )}
                          {post.likes > 1 && <p>{post.likes} Likes</p>}

                          {/* number of comment on this post, hide p when no comment */}
                          {post.totalcomment > 0 && post.totalcomment <= 1 && (
                            <p
                              onClick={() => toggleComment(post.post_id)}
                              className="cursor-pointer"
                            >
                              {post.totalcomment} Commentaire
                            </p>
                          )}
                          {post.totalcomment > 1 && (
                            <p
                              onClick={() => toggleComment(post.post_id)}
                              className="cursor-pointer"
                            >
                              {post.totalcomment} Commentaires
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex border-t-2 border-gray-300 py-1">
                        <div className="basis-1/2 text-center my-1">
                          <LikePost
                            likeUserId={post.likeuserid}
                            post_id={post.post_id}
                            setRefresh={setRefresh}
                          />
                        </div>
                        <div className="basis-1/2 text-center my-1">
                          <CommentButton
                            post_id={post.post_id}
                            setFlashMessage={setFlashMessage}
                          />
                        </div>
                      </div>
                      {showComment[post.post_id] ? (
                        <Comment comment={post.comment} />
                      ) : null}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Feed;
