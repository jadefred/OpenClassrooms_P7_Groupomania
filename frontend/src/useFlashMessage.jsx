import { useState } from 'react'

const useFlashMessage = () => {
  const [flashMessage, setFlashMessage] = useState('')

  const timeOutMessage = () => {
    setTimeout(() => {
      setFlashMessage('')
    }, 3000)
  }

  return { flashMessage, setFlashMessage, timeOutMessage }
}

export default useFlashMessage
