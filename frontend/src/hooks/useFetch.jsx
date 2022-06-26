import { useEffect, useState } from 'react';
import useLogStatus from '../Context';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useLogStatus();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        response.json().then((result) => {
          setData(result);
        });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(setIsLoaded(true), setRefresh(false));
  }, [url, refresh]);

  return { data, isLoaded, error, setRefresh };
}

export default useFetch;
