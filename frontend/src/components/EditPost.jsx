import React, { useState, useContext } from 'react'
import { UserContext } from '../Context'

function EditPost({ modal, setModal, post, setFlashMessage }) {
  const { user } = useContext(UserContext)
  const [image, setImage] = useState()
  const [input, setInput] = useState({
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
  })
  const [preview, setPreview] = useState(input.imageUrl)
  const [formNotComplete, setFormNotComplete] = useState(false)
  const [btnDisable, setBtnDisable] = useState(true)

  //close modal after clicked overlay
  function toggleModal() {
    setModal((prev) => !prev)
  }

  //freeze body from scrolling when modal is there
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  //handle title and content input change
  function handleEditPost(e) {
    setInput({ ...input, [e.target.name]: e.target.value })
    setBtnDisable(false)
  }

  //handle image input, check mime type before set to the state
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

  function handleModifyPost(e) {
    e.preventDefault()
    //pop error message if title / body content is empty and return function
    if (
      input.title === '' ||
      (input.title !== '' && input.content === '' && !image) ||
      (input.title !== '' && input.content === '' && input.imageUrl === '')
    ) {
      setFormNotComplete(true)
      return
    }

    //create form data, append image when user added
    const formData = new FormData()
    formData.append('userId', user.userId)
    formData.append('title', input.title)
    formData.append('content', input.content)
    formData.append('postId', post.postId)

    //append image if it exists
    if (image) {
      formData.append('image', image)
    } else {
      formData.append('image', input.imageUrl)
    }

    async function modifyPost() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'PUT',
        headers: { authorization: `Bearer ${user.token}` },
        body: formData,
      })
      setModal(false)
      //flash success message if res is ok, then reset state to make it disappear
      if (response.ok) {
        setFlashMessage('Vous avez modifié un post')
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
    modifyPost()
  }

  //remove selected image / the image from server
  function removeSelectedImg() {
    setImage(null)
    setPreview(null)
    setInput({ ...input, imageUrl: '' })
    setBtnDisable(false)
  }

  //alert user, delete post if confirmed, then flash message
  function deletePost() {
    console.log(post.postId)
    console.log(user.userId)
  }

  return (
    <>
      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Modifer Post</h2>
            <form onSubmit={handleModifyPost}>
              <div>
                <label htmlFor="title">Titre :</label>
                <input
                  onChange={handleEditPost}
                  type="text"
                  name="title"
                  value={input.title}
                  required
                />
              </div>
              <div>
                <label htmlFor="content">Contenu :</label>
                <textarea
                  onChange={handleEditPost}
                  name="content"
                  cols="30"
                  rows="10"
                  value={input.content}
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
                {preview && (
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
                    <button type="button" onClick={removeSelectedImg}>
                      Supprimer l'image
                    </button>
                  </>
                )}
              </div>
              {formNotComplete && <p>Veuillez remplir les informations</p>}
              <div>
                <input type="submit" value="Envoyer" disabled={btnDisable} />
                <button onClick={toggleModal}>Annuler</button>
                <button type="button" onClick={deletePost}>
                  Supprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default EditPost
