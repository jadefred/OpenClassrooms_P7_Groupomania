import React from 'react'
import loader from '../assets/loadingSpinner.svg'

function Loading() {
  return (
    <>
      <img
        src={loader}
        alt="chargement"
        className="animate-spin w-32 h-32 mx-auto mt-32"
      />
    </>
  )
}

export default Loading
