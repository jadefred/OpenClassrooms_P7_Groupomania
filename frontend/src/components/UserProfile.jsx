import React, { useState, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import defaultProfil from '../assets/defaultProfil.svg'

function UserProfile() {
  const { data, loading, error } = useFetch(
    'http://localhost:3000/api/user',
    'GET'
  )
  const [image, setImage] = useState(null)
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

  //handle image input, check mime type before set to the state
  function handleImage(e) {
    const file = e.target.files[0]
    const mimeType =
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png'
        ? true
        : false

    if (file && mimeType) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setInput({ ...input, avatarUrl: reader.result })
      }
      reader.readAsDataURL(file)
    } else {
      setImage(null)
    }
  }

  //remove selected image / the image from server
  function removeSelectedImg() {
    setImage(null)
    setInput({ ...input, avatarUrl: '' })
  }

  return (
    <>
      {error && <p>Un problème apparu... Veuillez re-essayez plus tard</p>}

      {!error && data && (
        <div>
          <form>
            {input.avatarUrl ? (
              <img
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                src={input.avatarUrl}
                alt="l'avatar d'utilisateur"
              />
            ) : (
              <img
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                src={defaultProfil}
                alt="l'avatar d'utilisateur"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImage}
            />
            <button type="button" onClick={removeSelectedImg}>
              Supprimer l'image
            </button>
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
      )}
    </>
  )
}

export default UserProfile
