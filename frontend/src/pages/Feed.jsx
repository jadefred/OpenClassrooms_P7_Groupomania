import React, { useState, useEffect, useCallback } from 'react';
import useLogStatus from '../Context';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

//custom hooks
//import useFetch from '../hooks/useFetch';
import useFlashMessage from '../hooks/useFlashMessage';

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
  const { userId, admin, dispatchLogout } = useLogStatus();
  const [noPostMsg, setNoPostMsg] = useState(false);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState(false);
  // const { data, isLoaded, error, setRefresh, status } = useFetch(
  //   'http://localhost:3000/api/posts'
  // );

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    console.log('useEffect is called');
    //fetch all post data
    async function getAllData() {
      try {
        const response = await fetch('http://localhost:3000/api/posts', {
          method: 'GET',
          credentials: 'include',
          headers: {
            authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        });
        const fetchData = await response.json();

        setData(fetchData);
        setStatus(response.status);
        setIsLoaded(true);
      } catch (error) {
        setError(true);
        setIsLoaded(true);
      }
    }

    getAllData();
  }, [refresh]);

  //change useFetch to async fetch and wrap it in useEffect to prevent too much rendering

  console.count('Feed rendered :');
  console.log('Feed ', data);
  console.log('Feed - refresh ', refresh);

  //if authentication is failed, force user to log out
  useEffect(() => {
    if (status === 403 || status === 401) {
      Cookies.remove('accessToken');
      dispatchLogout();
      navigate('/');
    }
  }, [status, dispatchLogout, navigate]);

  //when data contains no post, show no post message
  useEffect(() => {
    if (data && data?.length === 0) {
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

  // //toggle modal when clicked modifer post button (useCallback to memorize function before pass it as props to child)
  // const toggleModal = useCallback((id) => {
  //   setModal((prev) =>
  //     Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
  //   );
  // }, []);

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

        {isLoaded && !error && data && data.length > 0 && (
          <div className="w-full flex flex-col gap-y-10 text-tertiaire">
            {/* map throught allPosts state to display all content */}
            {data.map((post) => {
              return (
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
                      post_id={post.post_id}
                      setModal={setModal}
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
                          refresh={refresh}
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
                        showComment={showComment}
                        setShowComment={setShowComment}
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
                          setNewComment={setNewComment}
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
                        newComment={newComment}
                        setNewComment={setNewComment}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Feed;
