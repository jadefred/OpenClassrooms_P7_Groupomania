import React, { useState } from 'react'

function EditPost({ modal, setModal, post }) {
  const [input, setInput] = useState({
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
  })

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
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                />
                {input.imageUrl && (
                  <img
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                    src={input.imageUrl}
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
