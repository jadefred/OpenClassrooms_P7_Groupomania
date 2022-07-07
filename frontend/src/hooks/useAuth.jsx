import { useEffect } from 'react';
import Cookies from 'js-cookie';

function useAuth() {
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/token', {
      method: 'GET',
      headers: {
        credentials: 'include',
        authorization: `Bearer ${Cookies.get('accessToken')}`,
      },
    })
      .then(() => {
        if (document.cookie) {
          Cookies.set('accessToken', document.cookie);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
}

export default useAuth;
