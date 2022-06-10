import React, { useContext, useState, useRef } from 'react'
import { UserContext } from '../Context'

function CommentButton({ postId, setFlashMessage }) {
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const imageRef = useRef()
  const contentRef = useRef()
  const [formNotComplete, setFormNotComplete] = useState(false)
  const [btnDisable, setBtnDisable] = useState(true)

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
    formData.append('userId', user.userId)
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
        headers: { authorization: `Bearer ${user.token}` },
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
      <button onClick={toggleModal}>Commenter</button>

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Commenter</h2>
            <form onSubmit={creatComment}>
              <div>
                <label htmlFor="content">Contenu :</label>
                <textarea
                  onChange={handleInput}
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
                <input type="submit" value="Commenter" disabled={btnDisable} />
                <button onClick={toggleModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CommentButton
