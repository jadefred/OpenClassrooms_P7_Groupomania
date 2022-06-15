import React, { useState, useEffect } from 'react'
//import '../styles/feed.css'
import useFlashMessage from '../hooks/useFlashMessage'
import useLogStatus from '../Context'
import editPostLogo from '../assets/editPost.svg'

//components
import NavBar from '../components/NavBar.jsx'
import Comment from '../components/Comment.jsx'
import NewPost from '../components/NewPost.jsx'
import EditPost from '../components/EditPost.jsx'
import FlashMessage from '../components/FlashMessage'
import CommentButton from '../components/CommentButton'
import LikePost from '../components/LikePost'

function Feed() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [showComment, setShowComment] = useState({})
  const [modal, setModal] = useState({})
  const { flashMessage, setFlashMessage, timeOutMessage } = useFlashMessage()
  const { userId, token, admin } = useLogStatus()

  //toggle comment block, map id key to target clicked element
  function toggleComment(id) {
    setShowComment((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    )
  }

  //toggle modal when clicked modifer post button
  function toggleModal(id) {
    setModal((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    )
  }

  //fetch to get all posts
  useEffect(() => {
    async function getAllPosts() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      })
      if (response.status !== 200) {
        setError(true)
      }
      const data = await response.json()
      setAllPosts(data)
      setIsLoaded(true)
    }
    getAllPosts()
  }, [])

  return (
    <>
      <NavBar />
      <NewPost />

      {/* flash message pops up after user edited a post */}
      {flashMessage !== '' && <FlashMessage flashMessage={flashMessage} />}

      <div className="w-8/12 border mx-auto">
        {isLoaded && error && <p>Something went wrong...</p>}

        {isLoaded && !error && (
          <div className="w-full flex flex-col text-tertiaire ">
            {/* map throught allPosts state to display all content */}
            {allPosts.map((post) => {
              return (
                <>
                  <div key={post.postId} className="border">
                    <div>
                      {/* username, avatar and edit button block */}
                      <div className="border flex justify-between px-3 py-1 ">
                        <div className="flex items-center gap-x-3">
                          <img
                            src={post.avatarUrl}
                            alt={`l'avatar de ${post.username}`}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <p className="font-bold text-md">{post.username}</p>
                        </div>
                        {/* render edit button if user is op / admin  */}
                        {(post.userId === userId || admin) && (
                          <button
                            onClick={() => {
                              toggleModal(post.postId)
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
                        {/* render edit post component when content according postId */}
                        {modal[post.postId] && (
                          <EditPost
                            post={post}
                            postId={post.postId}
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
                        {post.imageUrl !== '' && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="w-full mt-5">
                        <div className="w-9/12 flex mx-auto justify-evenly ">
                          {/* number of people liked this post, hide p whee like is 0 */}
                          {post.like > 0 && post.like <= 1 && (
                            <p>{post.like} Like</p>
                          )}
                          {post.like > 1 && <p>{post.like} Likes</p>}

                          {/* number of comment on this post, hide p when no comment */}
                          {post.totalComment > 0 && post.totalComment <= 1 && (
                            <p
                              onClick={() => toggleComment(post.postId)}
                              className="cursor-pointer"
                            >
                              {post.totalComment} Commentaire
                            </p>
                          )}
                          {post.totalComment > 1 && (
                            <p
                              onClick={() => toggleComment(post.postId)}
                              className="cursor-pointer"
                            >
                              {post.totalComment} Commentaires
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex border">
                        <div className="basis-1/2 text-center my-1">
                          <LikePost
                            likeUserId={post.likeUserId}
                            postId={post.postId}
                          />
                        </div>
                        <div className="basis-1/2 text-center my-1">
                          <CommentButton
                            postId={post.postId}
                            setFlashMessage={setFlashMessage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {showComment[post.postId] ? (
                    <Comment comment={post.comment} />
                  ) : null}
                </>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Feed
