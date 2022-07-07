import { useEffect } from 'react';
import Cookies from 'js-cookie';

function useAuth() {
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/token', {
      method: 'POST',
      headers: {
        credentials: 'include',
        authorization: `Bearer ${Cookies.get('accessToken')}`,
      },
    })
      .then((response) => {
        console.log(response.headers);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
}

export default useAuth;
