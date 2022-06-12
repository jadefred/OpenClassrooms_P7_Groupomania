import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import defaultProfil from '../assets/defaultProfil.svg'
import { asyncFetch } from '../Utils'

//custom hooks
import useFetch from '../hooks/useFetch'
import useLogStatus from '../Context'

function UserProfile({ setFlashMessage, timeOutMessage }) {
  const { userId, token } = useLogStatus()
  const { data, loading, error } = useFetch('http://localhost:3000/api/user')
  const [image, setImage] = useState(null)
  const [formNotComplete, setFormNotComplete] = useState(false)
  const [btnDisable, setBtnDisable] = useState(true)
  const [input, setInput] = useState({
    username: '',
    email: '',
    avatarUrl: '',
    admin: false,
  })

  //once fetch's data is loaded, update state
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

  //update username state
  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
    setBtnDisable(false)
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
      setBtnDisable(false)
    } else {
      setImage(null)
    }
  }

  //remove selected image / the image from server
  function removeSelectedImg() {
    setImage(null)
    setInput({ ...input, avatarUrl: '' })
    setBtnDisable(false)
  }

  function handleUserAccount(e) {
    e.preventDefault()

    //pop error message if title / body content is empty and return function
    if (input.username === '') {
      setFormNotComplete(true)
      return
    }

    //create form data, append image when user added
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('username', input.username)

    //append image if it exists
    if (image) {
      formData.append('image', image)
    } else {
      formData.append('image', input.avatarUrl)
    }

    //use async function to finish post request
    const data = asyncFetch(
      'http://localhost:3000/api/user',
      'PUT',
      token,
      formData,
      true
    )

    //pop flash message according fetch status
    if (data) {
      setFlashMessage('Vous avez modifié votre profil')
      timeOutMessage()
    } else {
      setFlashMessage('Un problème a apparu..')
      timeOutMessage()
    }
  }

  return (
    <>
      {error && <h2>Un problème apparu... Veuillez re-essayez plus tard</h2>}

      {!error && data && (
        <div>
          <form onSubmit={handleUserAccount}>
            {/* if avatarUrl is not empty, display image. Display default svg profile picture when avatarUrl is empty */}
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

            {/* button to remove avatar or selected image */}
            <button type="button" onClick={removeSelectedImg}>
              Supprimer l'image
            </button>
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              onChange={handleInput}
              type="text"
              name="username"
              value={input.username}
              required
            />

            {/* email input field can't be modified, display address only */}
            <label htmlFor="email">L'adresse mail : </label>
            <input type="text" name="email" value={input.email} disabled />

            {/* user data will decide p value - admin / normal user */}
            <p>Type de compte : </p>
            {input.admin ? <p>Administrateur</p> : <p>Utilisateur</p>}

            {/* warning message pops up when form is username is empty */}
            {formNotComplete && <p>Veuillez remplir les informations</p>}

            {/* buttons to submit, disable by default when no change is detected. return button back to feed */}
            <input type="submit" value="Modifier" disabled={btnDisable} />
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
