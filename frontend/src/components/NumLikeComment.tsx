import { memo, useEffect, FC } from 'react';
import { IUnknownObjectKey } from '../interfaces';

interface IProps {
  likes: number;
  totalcomment: number;
  post_id: string;
  toggleComment: (id: string) => void;
  setShowComment: React.Dispatch<React.SetStateAction<IUnknownObjectKey>>;
  showComment: IUnknownObjectKey;
}

const NumLikeComment: FC<IProps> = ({
  likes,
  totalcomment,
  post_id,
  toggleComment,
  setShowComment,
  showComment,
}) => {
  //if total comment is 0 and in the object of showComment is containing the post related value
  //trigger useEffect to remove the post related value from showComment object
  //to prevent the problem showComment object saved the obsolete key (to display comment or not)
  //and cause the problem of toggle the comment when new comment is added
  useEffect(() => {
    if (totalcomment === 0 && showComment[post_id]) {
      setShowComment((prev) => {
        const newObj = Object.keys(prev)
          .filter((i) => i !== post_id)
          .reduce((i: IUnknownObjectKey, key) => {
            i[key] = prev[key];
            return i;
          }, {});

        return newObj;
      });
    }
  }, [post_id, showComment, totalcomment, setShowComment]);

  return (
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
  );
};

export default NumLikeComment;
export const MemoizedNumLikeComment = memo(NumLikeComment);
