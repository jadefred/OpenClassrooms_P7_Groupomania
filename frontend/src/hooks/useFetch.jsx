import { useEffect, useState } from 'react'
import useLogStatus from '../Context'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useLogStatus()

  useEffect(() => {
    setIsLoaded(true)

    fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        response.json().then((result) => {
          setData(result)
        })
      })
      .catch((err) => {
        setError(err)
      })
      .finally(setIsLoaded(false))
  }, [url])

  return { data, isLoaded, error }
}

export default useFetch
