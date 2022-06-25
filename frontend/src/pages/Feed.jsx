import React, { useState, useEffect } from 'react';
import useFlashMessage from '../hooks/useFlashMessage';
import useLogStatus from '../Context';
import editPostLogo from '../assets/editPost.svg';
import defaultProfil from '../assets/defaultProfil.svg';

//components
import NavBar from '../components/NavBar.jsx';
import Comment from '../components/Comment.jsx';
import NewPost from '../components/NewPost.jsx';
import EditPost from '../components/EditPost.jsx';
import FlashMessage from '../components/FlashMessage';
import CommentButton from '../components/CommentButton';
import LikePost from '../components/LikePost';

function Feed() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [showComment, setShowComment] = useState({});
  const [modal, setModal] = useState({});
  const { flashMessage, setFlashMessage, timeOutMessage } = useFlashMessage();
  const { userId, token, admin } = useLogStatus();
  const [clickLike, setClickLike] = useState(true);
  const [noPostMsg, setNoPostMsg] = useState(false);

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

  //fetch to get all posts
  //depends on clickLike, once user is clicked LikePost component's button, trigger useEffect to re-render allPost data in order to get latest number of like
  useEffect(() => {
    getAllPosts();
  }, [clickLike, flashMessage]);

  async function getAllPosts() {
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError(true);
        setIsLoaded(true);
      }

      const data = await response.json();

      if (data.length === 0) {
        setIsLoaded(true);
        setNoPostMsg(true);
      }

      setAllPosts(data);
      setIsLoaded(true);
    } catch (error) {
      setError(true);
      setIsLoaded(true);
    }
  }

  return (
    <>
      <NavBar />
      {isLoaded && !error && (
        <NewPost
          setFlashMessage={setFlashMessage}
          timeOutMessage={timeOutMessage}
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

        {isLoaded && !error && (
          <div className="w-full flex flex-col gap-y-10 text-tertiaire">
            {/* map throught allPosts state to display all content */}
            {allPosts.map((post) => {
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
                        {(post.userId === userId || admin) && (
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
                            timeOutMessage={timeOutMessage}
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
                          {post.like > 0 && post.like <= 1 && (
                            <p>{post.like} Like</p>
                          )}
                          {post.like > 1 && <p>{post.like} Likes</p>}

                          {/* number of comment on this post, hide p when no comment */}
                          {post.totalComment > 0 && post.totalComment <= 1 && (
                            <p
                              onClick={() => toggleComment(post.post_id)}
                              className="cursor-pointer"
                            >
                              {post.totalComment} Commentaire
                            </p>
                          )}
                          {post.totalComment > 1 && (
                            <p
                              onClick={() => toggleComment(post.post_id)}
                              className="cursor-pointer"
                            >
                              {post.totalComment} Commentaires
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex border-t-2 border-gray-300 py-1">
                        <div className="basis-1/2 text-center my-1">
                          <LikePost
                            likeUserId={post.likeuserid}
                            post_id={post.post_id}
                            setClickLike={setClickLike}
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
