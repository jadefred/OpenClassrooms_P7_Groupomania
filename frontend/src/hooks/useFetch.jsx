import { useEffect, useState } from 'react';
//import useLogStatus from '../Context';
import Cookies from 'js-cookie';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  //const { token } = useLogStatus();
  const token = Cookies.get('accessToken');
  const [refresh, setRefresh] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (refresh) {
      fetch(url, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setStatus(response.status);
          response.json().then((result) => {
            setData(result);
          });
        })
        .catch((err) => {
          setError(err);
        })
        .finally(setIsLoaded(true), setRefresh(false));
    }
  }, [url, refresh, token]);

  return { data, isLoaded, error, setRefresh, status };
}

export default useFetch;
