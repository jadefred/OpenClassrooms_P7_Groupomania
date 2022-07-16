import React from 'react';

function FlashMessage(props) {

  return (
    <div className="bg-emerald-700 w-72 mx-auto px-4 py-2 text-center rounded-md my-2">
      <p className="text-white">{props.flashMessage}</p>
    </div>
  );
}

export default FlashMessage;
