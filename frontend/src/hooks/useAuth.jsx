import { useEffect } from 'react';
import Cookies from 'js-cookie';

function useAuth() {
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/token', {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${Cookies.get('accessToken')}`,
      },
    })
      .then(console.log('useAuth hook called /token'))

      .catch((err) => {
        console.log(err);
      });
  }, []);
}

export default useAuth;
