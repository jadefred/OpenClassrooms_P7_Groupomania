import React, { useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../Context'
import '../styles/newPost.css'

function NewPost() {
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)
  const titleRef = useRef()
  const contentRef = useRef()
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [formNotComplete, setFormNotComplete] = useState(false)

  //useEffect to render the preview of image
  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(image)
    } else {
      setPreview(null)
    }
  }, [image])

  function toggleModal() {
    setModal((prev) => !prev)
    if (!modal) {
      setPreview(null)
      setImage(null)
    }
  }

  //freeze background body scrolling when modal is actived
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
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
    } else {
      setImage(null)
    }
  }

  function createNewPost(e) {
    e.preventDefault()

    if (titleRef === '' || contentRef === '') {
      setFormNotComplete(true)
    }

    console.log(image)

    const formData = new FormData()
    formData.append('userId', user.userId)
    formData.append('title', titleRef.current.value)
    formData.append('content', contentRef.current.value)

    if (image) {
      formData.append('image', image)
    }

    async function createPost() {
      await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        body: formData,
      })
      setModal(false)
    }
    createPost()
  }

  return (
    <>
      <div>
        <p>{user.username}, écrivez quelque chose ...</p>
        <button onClick={toggleModal}>Nouveau Post</button>
      </div>

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Nouveau Post</h2>
            <form onSubmit={createNewPost}>
              <div>
                <label htmlFor="title">Titre :</label>
                <input ref={titleRef} type="text" name="title" required />
              </div>
              <div>
                <label htmlFor="content">Contenu :</label>
                <textarea
                  ref={contentRef}
                  name="content"
                  cols="30"
                  rows="10"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="image">Image : </label>
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImage}
                />
                {image && (
                  <img
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                    src={preview}
                    alt=""
                  />
                )}
              </div>
              {formNotComplete && (
                <p>Veuillez remplir le titre et le contenu</p>
              )}
              <div>
                <input type="submit" value="Envoyer" />
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
