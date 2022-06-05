import React, { useContext, useState } from 'react'
import { UserContext } from '../Context'
import '../styles/newPost.css'

function NewPost() {
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)

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
      <div>
        <p>{user.username}, écrivez quelque chose ...</p>
        <button onClick={toggleModal}>Nouveau Post</button>
      </div>

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Nouveau Post</h2>
            <form>
              <div>
                <label htmlFor="title">Titre : </label>
                <input type="text" name="title" />
              </div>
              <div>
                <label htmlFor="content">Contenu : </label>
                <textarea name="content" cols="30" rows="10"></textarea>
              </div>
              <div>
                <label htmlFor="image">Image : </label>
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                />
              </div>
            </form>
            <div>
              <button>Envoyer</button>
              <button onClick={toggleModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NewPost
