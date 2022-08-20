import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function useFetch(url: string) {
  const [data, setData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const token = Cookies.get('accessToken');
  const [refresh, setRefresh] = useState<boolean>(true);
  const [status, setStatus] = useState<number>();

  useEffect(() => {
    if (refresh) {
      fetch(url, {
        method: 'GET',
        credentials: 'include',
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
        .finally(() => {
          setIsLoaded(true);
          setRefresh(false);
        });
    }
  }, [url, refresh, token]);

  return { data, isLoaded, error, setRefresh, status };
}

export default useFetch;
