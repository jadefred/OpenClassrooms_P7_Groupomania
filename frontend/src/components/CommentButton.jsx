import React, { useContext, useState } from 'react'
import { UserContext } from '../Context'

function CommentButton({ postId }) {
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)

  function toggleModal() {
    setModal((prev) => !prev)
  }

  //freeze background body from scrolling when modal is actived
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      <button onClick={toggleModal}>Commenter</button>

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Commenter</h2>
            <form>
              <div>
                <label htmlFor="content">Contenu :</label>
                <textarea
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
                />
              </div>
              <div>
                <input type="submit" value="Commenter" />
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
