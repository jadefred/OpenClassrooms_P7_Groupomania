import React, { memo } from 'react';

function PostContent({ title, content, imageurl }) {
  return (
    <div className="flex flex-col gap-y-4 w-9/12 mx-auto my-3">
      <h2 className="font-bold text-2xl">{title}</h2>
      <p>{content}</p>
      {/* appear only when imageUrl is added */}
      {imageurl && (
        <img src={imageurl} alt={title} className="w-full object-cover" />
      )}
    </div>
  );
}

export default PostContent;
export const MemoizedPostContent = memo(PostContent);
