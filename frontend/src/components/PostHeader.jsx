import React, { memo } from 'react';
import editPostLogo from '../assets/editPost.svg';
import defaultProfil from '../assets/defaultProfil.svg';

function PostHeader({
  avatar_url,
  username,
  post_id,
  user_id,
  userId,
  admin,
  toggleModal,
}) {
  console.log(`render post ${post_id}`);
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
}

export default memo(PostHeader);