import { useState, useEffect } from 'react';

const useFlashMessage = () => {
  const [flashMessage, setFlashMessage] = useState('');

  //when flashMessage is set, trigger timeout function and clear message
  useEffect(() => {
    if (flashMessage !== '') {
      timeOutMessage();
    }
  }, [flashMessage]);

  const timeOutMessage = () => {
    setTimeout(() => {
      setFlashMessage('');
    }, 3000);
  };

  return { flashMessage, setFlashMessage };
};

export default useFlashMessage;
