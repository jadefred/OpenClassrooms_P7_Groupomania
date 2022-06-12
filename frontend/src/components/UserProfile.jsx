import React, { useState, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import { Link } from 'react-router-dom'

function UserProfile() {
  const { data, loading, error } = useFetch(
    'http://localhost:3000/api/user',
    'GET'
  )
  const [input, setInput] = useState({
    username: '',
    email: '',
    avatarUrl: '',
    admin: false,
  })

  useEffect(() => {
    if (data) {
      setInput({
        username: data.username,
        avatarUrl: data.avatarUrl,
        email: data.email,
        admin: data.admin,
      })
    }
  }, [data])

  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  return (
    <>
      {error && <p>Un problème apparu... Veuillez re-essayez plus tard</p>}

      {!error && data && (
        <div>
          <div>
            <img
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              src={input.avatarUrl}
              alt="l'avatar d'utilisateur"
            />
          </div>
          <div>
            <form>
              <label htmlFor="username">Nom d'utilisateur :</label>
              <input
                onChange={handleInput}
                type="text"
                name="username"
                value={input.username}
              />
              <label htmlFor="email">L'adresse mail : </label>
              <input type="text" name="email" value={input.email} disabled />
              <p>Type de compte : </p>
              {input.admin ? <p>Administrateur</p> : <p>Utilisateur</p>}
              <input type="submit" value="Modifier" />
              <Link to="/feed">
                <button type="button">Retourner</button>
              </Link>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default UserProfile
