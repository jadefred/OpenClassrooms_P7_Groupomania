import React, { useState, useRef } from 'react'
import useLogStatus from '../Context'
import commentIcon from '../assets/commentBtn.svg'

function CommentButton({ postId, setFlashMessage }) {
  const [modal, setModal] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const imageRef = useRef()
  const contentRef = useRef()
  const [formNotComplete, setFormNotComplete] = useState(false)
  const [btnDisable, setBtnDisable] = useState(true)
  const { userId, token } = useLogStatus()

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

  //enable submit button when content is detected
  function handleInput() {
    if (contentRef.current.value !== '') {
      setBtnDisable(false)
    } else {
      setBtnDisable(true)
    }
  }

  //handle image input, check mime type before set to the state, and render preview image, enable submit if image is there
  function handleImage(e) {
    setBtnDisable(false)
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

  function removeSelectedImg() {
    setImage(null)
    imageRef.current.value = null
  }

  //fetch comment to endpoint
  function creatComment(e) {
    e.preventDefault()

    //comment has to contain either content or image
    if (contentRef.current.value === '' && !image) {
      setFormNotComplete(true)
      return
    }

    //create form data, append image when user added
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('postId', postId)

    if (image) {
      formData.append('image', image)
    }
    if (contentRef.current.value !== '') {
      formData.append('content', contentRef.current.value)
    }

    async function createComment() {
      const response = await fetch('http://localhost:3000/api/posts/comments', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      })
      setModal(false)
      // flash success message if res is ok, then reset state to make it disappear
      if (response.ok) {
        setFlashMessage('Vous avez posté un commentaire')
        setTimeout(() => {
          setFlashMessage('')
        }, 3000)
      }
      //fail flash message
      else {
        setFlashMessage('Un problème a apparu..')
        setTimeout(() => {
          setFlashMessage('')
        }, 3000)
      }
    }
    createComment()
  }

  return (
    <>
      <button
        onClick={toggleModal}
        className="flex mx-auto items-center gap-x-2"
      >
        <img src={commentIcon} alt="bouton de commenter" className="w-6 h-6" />
        <p>Commenter</p>
      </button>

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Commenter</h2>
            <form onSubmit={creatComment}>
              <div className="formInputField">
                <label htmlFor="content">Contenu : </label>
                <textarea
                  onChange={handleInput}
                  ref={contentRef}
                  name="content"
                  cols="40"
                  rows="3"
                ></textarea>
              </div>
              <div className="formInputField">
                <label htmlFor="image">Image : </label>
                <input
                  ref={imageRef}
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImage}
                  className="NewPost--hidden-file-input"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    imageRef.current.click()
                  }}
                  className="NewPost--add-image-btn"
                >
                  Choisir une image
                </button>
              </div>
              {image && (
                <div className="NewPost--file">
                  <img
                    src={preview}
                    alt="téléchargement"
                    className="NewPost--file__image"
                  />
                  <button
                    onClick={removeSelectedImg}
                    className="NewPost--file__btn"
                  >
                    Supprimer l'image
                  </button>
                </div>
              )}

              {formNotComplete && (
                <p className="text-primaire">
                  Veuillez remplir les informations
                </p>
              )}
              <div className="NewPost--btn-wrapper">
                <input
                  type="submit"
                  value="Commenter"
                  disabled={btnDisable}
                  className="NewPost--submit-btn"
                />
                <button onClick={toggleModal} className="NewPost--cancel-btn">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CommentButton
