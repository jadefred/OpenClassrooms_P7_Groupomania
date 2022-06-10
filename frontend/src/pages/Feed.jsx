import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../Context'
import '../styles/feed.css'

//components
import NavBar from '../components/NavBar.jsx'
import Comment from '../components/Comment.jsx'
import NewPost from '../components/NewPost.jsx'
import EditPost from '../components/EditPost.jsx'
import FlashMessage from '../components/FlashMessage'
import CommentButton from '../components/CommentButton'

function Feed() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [showComment, setShowComment] = useState({})
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState({})
  const [flashMessage, setFlashMessage] = useState('')

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

  //fetch to get all postu
  useEffect(() => {
    async function getAllPosts() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: { authorization: `Bearer ${user.token}` },
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

  async function likePost(userId, likeUserId) {
    //use some to determine if the user has already liked this post
    //send 0 if he already liked -> retrieve the like
    //send 1 if he hasn't react to the post
    const userliked = likeUserId.some((i) => i === userId) ? 0 : 1
    const response = await fetch('http://localhost:3000/api/posts/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ userId, like: userliked }),
    })
    const data = await response.json()
    console.log(data)
  }

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
                        {(post.userId === user.userId || user.admin) && (
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
                      <button
                        onClick={() => {
                          likePost(user.userId, post.likeUserId)
                        }}
                        style={
                          post.likeUserId.some((i) => i === user.userId)
                            ? { color: 'green' }
                            : {}
                        }
                      >
                        J'aime
                      </button>
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
