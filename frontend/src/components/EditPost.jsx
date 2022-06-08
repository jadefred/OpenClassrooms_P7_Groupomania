import React, { useState } from 'react'

function EditPost({ modal, setModal, postId }) {
  function toggleModal() {
    setModal((prev) => !prev)
  }

  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
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
                <input type="text" name="title" required />
              </div>
              <div>
                <label htmlFor="content">Contenu :</label>
                <textarea name="content" cols="30" rows="10"></textarea>
              </div>
              <div>
                <label htmlFor="image">Image : </label>
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                />
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
