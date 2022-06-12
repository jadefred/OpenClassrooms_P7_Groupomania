import { useEffect, useState } from 'react'
import useLogStatus from '../Context'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useLogStatus()

  useEffect(() => {
    setLoading(true)

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
      .finally(setLoading(false))
  }, [url])

  return { data, loading, error }
}

export default useFetch
