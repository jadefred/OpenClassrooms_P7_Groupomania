import React, { useState, useRef } from 'react'
import '../styles/newPost.css'
import FlashMessage from './FlashMessage'
import useFlashMessage from '../hooks/useFlashMessage'
import useLogStatus from '../Context'

function NewPost() {
  //const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)
  const titleRef = useRef()
  const contentRef = useRef()
  const imageRef = useRef()
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [formNotComplete, setFormNotComplete] = useState(false)
  const [btnDisable, setBtnDisable] = useState(true)
  const { flashMessage, setFlashMessage, timeOutMessage } = useFlashMessage()
  const { userId, username, token } = useLogStatus()

  function toggleModal() {
    setModal((prev) => !prev)
    if (!modal) {
      setPreview(null)
      setImage(null)
      setFormNotComplete(false)
      setBtnDisable(true)
    }
  }

  //freeze background body from scrolling when modal is actived
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  //enable submit button when title is detected
  function handleTitle() {
    if (titleRef.current.value !== '') {
      setBtnDisable(false)
    } else {
      setBtnDisable(true)
    }
  }

  //handle image input, check mime type before set to the state, set image local url as preview
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
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImage(null)
    }
  }

  function createNewPost(e) {
    e.preventDefault()
    //pop error message if title / body content is empty and return function
    if (
      titleRef.current.value === '' ||
      (titleRef.current.value !== '' &&
        contentRef.current.value === '' &&
        !image)
    ) {
      setFormNotComplete(true)
      return
    }

    //create form data, append image when user added
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('title', titleRef.current.value)
    formData.append('content', contentRef.current.value)

    //append image if it exists
    if (image) {
      formData.append('image', image)
    }

    async function createPost() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      })
      setModal(false)
      // flash success message if res is ok, then reset state to make it disappear
      if (response.ok) {
        setFlashMessage('Vous avez créé un post')
        timeOutMessage()
      }
      //fail flash message
      else {
        setFlashMessage('Un problème a apparu..')
        timeOutMessage()
      }
    }
    createPost()
  }

  function removeSelectedImg() {
    setImage(null)
    imageRef.current.value = null
  }

  return (
    <>
      <div>
        {username ? (
          <p>{username}, partargez nous quelque chose ...</p>
        ) : (
          <p>Écrivez quelque chose...</p>
        )}
        <button onClick={toggleModal}>Nouveau Post</button>
      </div>

      {flashMessage !== '' && <FlashMessage flashMessage={flashMessage} />}

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Nouveau Post</h2>
            <form onSubmit={createNewPost}>
              <div>
                <label htmlFor="title">Titre :</label>
                <input
                  onChange={handleTitle}
                  ref={titleRef}
                  type="text"
                  name="title"
                  required
                />
              </div>
              <div>
                <label htmlFor="content">Contenu :</label>
                <textarea
                  ref={contentRef}
                  name="content"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <div>
                <label htmlFor="image">Image : </label>
                <input
                  ref={imageRef}
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImage}
                />
                {image && (
                  <>
                    <img
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                      src={preview}
                      alt=""
                    />
                    <button onClick={removeSelectedImg}>
                      Supprimer l'image
                    </button>
                  </>
                )}
              </div>
              {formNotComplete && <p>Veuillez remplir les informations</p>}
              <div>
                <input type="submit" value="Envoyer" disabled={btnDisable} />
                <button onClick={toggleModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default NewPost
