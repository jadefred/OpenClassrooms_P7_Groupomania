import { useState, useEffect, memo, FC } from 'react';
import useLogStatus from '../Context';
import thumbOrange from '../assets/thumbUp-orange.svg';
import thumbgray from '../assets/thumbUp-gray.svg';

interface IProps {
  likeUserId: string[];
  post_id: string;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const LikePost: FC<IProps> = ({ likeUserId, post_id, setRefresh }) => {
  const { userId, token } = useLogStatus();
  const [liked, setLiked] = useState<boolean>(false);

  //useEffect to get initial value to see whether user has already liked this post
  useEffect(() => {
    if (likeUserId.length > 0) {
      setLiked(likeUserId.some((i) => i === userId));
    }
  }, [likeUserId, userId]);

  async function likePost(
    userId: string,
    likeUserId: string[],
    post_id: string
  ) {
    //use some to determine if the user has already liked this post
    //send 0 if he already liked -> retrieve the like
    //send 1 if he hasn't react to the post
    const userliked = likeUserId.some((i) => i === userId) ? 0 : 1;

    //use 1 / 0 to determine button's colour shown as liked or not
    if (userliked === 1) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    //props from Feed, change state when user clicked like button to trigger useEffect to re-render all post in Feed
    const response = await fetch('http://localhost:3000/api/posts/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, postId: post_id, like: userliked }),
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setRefresh((prev) => !prev);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          likePost(userId, likeUserId, post_id);
        }}
        className={`flex mx-auto items-center gap-x-2 ${
          liked ? 'text-primaire' : 'text-tertiaire'
        }`}
      >
        {liked ? (
          <img src={thumbOrange} alt="icône de pouce" className="w-5 h-5" />
        ) : (
          <img src={thumbgray} alt="icône de pouce" className="w-5 h-5" />
        )}{' '}
        <p>J'aime</p>
      </button>
    </>
  );
};

export default LikePost;
export const MemoizedLikePost = memo(LikePost);
