import { memo, FC } from 'react';
import editPostLogo from '../assets/editPost.svg';
import defaultProfil from '../assets/defaultProfil.svg';
import { IUnknownObjectKey } from '../interfaces';

interface IProps {
  avatar_url: string;
  username: string;
  user_id: string;
  userId: string;
  admin: boolean;
  post_id: string;
  setModal: React.Dispatch<React.SetStateAction<IUnknownObjectKey>>;
}

const PostHeader: FC<IProps> = ({
  avatar_url,
  username,
  user_id,
  userId,
  admin,
  post_id,
  setModal,
}) => {
  //toggle modal when clicked modifer post button
  const toggleModal = (id: string) => {
    setModal((prev) =>
      Boolean(!prev[id]) ? { ...prev, [id]: true } : { ...prev, [id]: false }
    );
  };

  return (
    <div className="flex justify-between px-3 py-1 text-white bg-lightGray rounded-t-md">
      <div className="flex items-center gap-x-3">
        <img
          src={avatar_url ? avatar_url : defaultProfil}
          alt={`l'avatar de ${username}`}
          className="w-10 h-10 object-cover rounded-full"
        />
        <p className="font-bold text-md">{username}</p>
      </div>
      {/* render edit button if user is op / admin  */}
      {(user_id === userId || admin) && (
        <button
          onClick={() => {
            toggleModal(post_id);
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
  );
};

export default PostHeader;

export const MemoizedPostHeader = memo(PostHeader);
