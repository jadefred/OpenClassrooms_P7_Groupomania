import React, { useState, useRef, useEffect } from 'react'

function EditPost({ modal, setModal, post }) {
  const imageRef = useRef()
  const [image, setImage] = useState()
  const [input, setInput] = useState({
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
  })
  const [preview, setPreview] = useState(input.imageUrl)

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

  function handleEditPost(e) {
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
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImage(null)
    }
  }
  
  return (
    <>
      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Modifer Post</h2>
            <form>
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
                  ref={imageRef}
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImage}
                />
                {preview && (
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

export default EditPost
