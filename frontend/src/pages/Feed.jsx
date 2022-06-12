import React, { useState, useEffect } from 'react'
import '../styles/feed.css'
import useFlashMessage from '../hooks/useFlashMessage'
import useLogStatus from '../Context'

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

      <div className="Feed">
        {isLoaded && error && <p>Something went wrong...</p>}

        {isLoaded && !error && (
          <div className="Feed__all-posts-wrapper">
            {/* map throught allPosts state to display all content */}
            {allPosts.map((post) => {
              return (
                <>
                  <div key={post.postId} className="Feed__one-post-wrapper">
                    <div>
                      <div>
                        <p>{post.username}</p>
                        <img
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                          }}
                          src={post.avatarUrl}
                          alt={`l'avatar de ${post.username}`}
                        />
                      </div>
                      <div>
                        {/* render edit button if user is op / admin  */}
                        {(post.userId === userId || admin) && (
                          <button
                            onClick={() => {
                              toggleModal(post.postId)
                            }}
                          >
                            Edit
                          </button>
                        )}

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
                    <div>
                      <h2>{post.title}</h2>
                    </div>
                    <div>
                      <p>{post.content}</p>
                      {/* appear only when imageUrl is added */}
                      {post.imageUrl !== '' && (
                        <img
                          style={{ width: '100px' }}
                          src={post.imageUrl}
                          alt={post.title}
                        />
                      )}
                    </div>
                    <div className="Feed__one-post--like-comment-box">
                      {/* number of people liked this post, hide p whee like is 0 */}
                      {post.like > 0 && post.like <= 1 && (
                        <p>{post.like} Like</p>
                      )}
                      {post.like > 1 && <p>{post.like} Likes</p>}

                      {/* number of comment on this post, hide p when no comment */}
                      {post.totalComment > 0 && post.totalComment <= 1 && (
                        <p onClick={() => toggleComment(post.postId)}>
                          {post.totalComment} Commentaire
                        </p>
                      )}
                      {post.totalComment > 1 && (
                        <p onClick={() => toggleComment(post.postId)}>
                          {post.totalComment} Commentaires
                        </p>
                      )}
                    </div>
                    <div>
                      <LikePost
                        likeUserId={post.likeUserId}
                        postId={post.postId}
                      />
                      <CommentButton
                        postId={post.postId}
                        setFlashMessage={setFlashMessage}
                      />
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
