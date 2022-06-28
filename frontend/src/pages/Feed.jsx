import React, { useState, useEffect, useCallback } from 'react';
import useFlashMessage from '../hooks/useFlashMessage';
import useLogStatus from '../Context';
import useFetch from '../hooks/useFetch';

//components
import { MemoizedNavBar } from '../components/NavBar.jsx';
import Comment from '../components/Comment.jsx';
import { MemoizedNewPost } from '../components/NewPost.jsx';
import EditPost from '../components/EditPost.jsx';
import FlashMessage from '../components/FlashMessage';
import { MemoizedCommentButton } from '../components/CommentButton';
import { MemoizedLikePost } from '../components/LikePost';
import { MemoizedPostHeader } from '../components/PostHeader';
import { MemoizedPostContent } from '../components/PostContent';
import { MemoizedNumLikeComment } from '../components/NumLikeComment';

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
  const toggleComment = useCallback((id) => {
    setShowComment((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    );
  }, []);

  //toggle modal when clicked modifer post button (useCallback to memorize function before pass it as props to child)
  const toggleModal = useCallback((id) => {
    setModal((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    );
  }, []);

  return (
    <>
      <MemoizedNavBar />
      {isLoaded && !error && (
        <MemoizedNewPost
          setFlashMessage={setFlashMessage}
          setRefresh={setRefresh}
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
                      {/* header of each post - username, avatar and edit button */}
                      <MemoizedPostHeader
                        avatar_url={post.avatar_url}
                        username={post.username}
                        user_id={post.user_id}
                        userId={userId}
                        admin={admin}
                        toggleModal={toggleModal}
                        post_id={post.post_id}
                      />
                      <div>
                        {/* render edit post component when content according post_id */}
                        {modal[post.post_id] && (
                          <EditPost
                            post={post}
                            modal={modal}
                            setModal={setModal}
                            setFlashMessage={setFlashMessage}
                            setRefresh={setRefresh}
                          />
                        )}
                      </div>
                    </div>

                    {/* Block of title, content, like, comment buttons */}
                    <div>
                      <MemoizedPostContent
                        title={post.title}
                        content={post.content}
                        imageurl={post.imageurl}
                      />
                      <div className="w-full mt-5 mb-2">
                        {/*Number of likes and comments*/}
                        <MemoizedNumLikeComment
                          likes={post.likes}
                          totalcomment={post.totalcomment}
                          post_id={post.post_id}
                          toggleComment={toggleComment}
                        />
                      </div>
                      <div className="flex border-t-2 border-gray-300 py-1">
                        <div className="basis-1/2 text-center my-1">
                          <MemoizedLikePost
                            likeUserId={post.likeuserid}
                            post_id={post.post_id}
                            setRefresh={setRefresh}
                          />
                        </div>
                        <div className="basis-1/2 text-center my-1">
                          <MemoizedCommentButton
                            post_id={post.post_id}
                            setFlashMessage={setFlashMessage}
                            setRefresh={setRefresh}
                          />
                        </div>
                      </div>
                      {/* Pass comment id to the component for fetch the comment data */}
                      {showComment[post.post_id] ? (
                        <Comment
                          commentId={post.commentid}
                          postId={post.post_id}
                          setFlashMessage={setFlashMessage}
                          feedSetRefresh={setRefresh}
                        />
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
