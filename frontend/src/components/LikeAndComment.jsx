import React from 'react';

function LikeAndComment({ post_id, likes, totalcomment, toggleComment }) {
  return (
    <div className="w-full mt-5 mb-2">
      <div className="w-9/12 flex mx-auto justify-end gap-x-8 ">
        {/* number of people liked this post, hide p whee like is 0 */}
        {likes > 0 && likes <= 1 && <p>{likes} Like</p>}
        {likes > 1 && <p>{likes} Likes</p>}

        {/* number of comment on this post, hide p when no comment */}
        {totalcomment > 0 && totalcomment <= 1 && (
          <p onClick={() => toggleComment(post_id)} className="cursor-pointer">
            {totalcomment} Commentaire
          </p>
        )}
        {totalcomment > 1 && (
          <p onClick={() => toggleComment(post_id)} className="cursor-pointer">
            {totalcomment} Commentaires
          </p>
        )}
      </div>
    </div>
  );
}

export default LikeAndComment;
