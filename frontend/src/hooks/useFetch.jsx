import { useEffect, useState } from 'react'
import useLogStatus from '../Context'

function useFetch(url, method, body) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useLogStatus()

  useEffect(() => {
    setLoading(true)

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
