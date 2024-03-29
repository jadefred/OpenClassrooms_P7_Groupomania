import { useState, useRef, FC } from 'react';
import useLogStatus from '../Context';
import { IDataFeed } from '../interfaces';

interface IProps {
  modal: {};
  setModal: React.Dispatch<React.SetStateAction<{}>>;
  post: IDataFeed;
  setFlashMessage: React.Dispatch<React.SetStateAction<string>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPost: FC<IProps> = ({
  modal,
  setModal,
  post,
  setFlashMessage,
  setRefresh,
}) => {
  const [image, setImage] = useState<File | null>();
  const [input, setInput] = useState<{
    title: string;
    content: string;
    imageUrl: string | null;
  }>({
    title: post.title,
    content: post.content,
    imageUrl: post.imageurl,
  });
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(
    input.imageUrl
  );
  const [formNotComplete, setFormNotComplete] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const { userId, token } = useLogStatus();
  const imageRef = useRef<HTMLInputElement>(null);

  //close modal after clicked overlay
  function closeModal() {
    setModal(false);
    document.body.classList.remove('active-modal');
  }

  //freeze body from scrolling when modal is there
  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  //handle title and content input change
  function handleEditPost(e: { target: { name: any; value: any } }) {
    setInput({ ...input, [e.target.name]: e.target.value });
    setBtnDisable(false);
  }

  //handle image input, check mime type before set to the state
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setBtnDisable(false);
      const file = e.target.files[0];
      const mimeType =
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
          ? true
          : false;

      if (file && mimeType) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImage(null);
      }
    }
  }

  function handleModifyPost(e: { preventDefault: () => void }) {
    e.preventDefault();
    //pop error message if title / body content is empty and return function
    if (
      input.title === '' ||
      (input.imageUrl === '' && input.content === '' && !image) ||
      (input.imageUrl === null && input.content === '' && !image)
    ) {
      setFormNotComplete(true);
      return;
    }

    //create form data, append image when user added
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', input.title);
    formData.append('content', input.content);
    formData.append('postId', post.post_id);

    //append image if it exists
    if (image) {
      formData.append('image', image);
    } else {
      if (input.imageUrl) formData.append('image', input.imageUrl);
    }

    async function modifyPost() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      });
      closeModal();
      //flash success message if res is ok, then reset state to make it disappear
      if (response.ok) {
        setFlashMessage('Vous avez modifié un post');
        setRefresh((prev) => !prev);
      }
      //fail flash message
      else {
        setFlashMessage('Un problème a apparu..');
      }
    }
    modifyPost();
  }

  //remove selected image / the image from server
  function removeSelectedImg() {
    setImage(null);
    setPreview(null);
    setInput({ ...input, imageUrl: '' });
    setBtnDisable(false);
  }

  //alert user, delete post if confirmed, then flash message
  function handleDeletePost() {
    if (window.confirm('Vous êtes sûr de supprimer ce post ?')) {
      deletePost();
    } else {
      return;
    }

    async function deletePost() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId, postId: post.post_id }),
      });

      closeModal();
      //flash success message if res is ok, then reset state to make it disappear
      if (response.ok) {
        setFlashMessage('Vous avez supprimé un post');
        setRefresh((prev) => !prev);
      }
      //fail flash message
      else {
        setFlashMessage('Un problème a apparu..');
      }
    }
  }

  return (
    <>
      {modal && (
        <div className="NewPost--modal">
          <div onClick={closeModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Modifer Post</h2>
            <form onSubmit={handleModifyPost}>
              <div className="formInputField">
                <label htmlFor="title">Titre : </label>
                <input
                  onChange={handleEditPost}
                  type="text"
                  name="title"
                  value={input.title}
                  required
                />
              </div>
              <div className="formInputField">
                <label htmlFor="content">Contenu : </label>
                <textarea
                  onChange={handleEditPost}
                  name="content"
                  cols={40}
                  rows={3}
                  value={input.content ? input.content : ''}
                ></textarea>
              </div>
              <div className="formInputField">
                <label htmlFor="image">Image : </label>
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImage}
                  ref={imageRef}
                  className="NewPost--hidden-file-input"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    imageRef.current!.click();
                  }}
                  className="NewPost--add-image-btn"
                >
                  Choisir une image
                </button>
              </div>
              {preview && (
                <div className="NewPost--file">
                  <img
                    src={typeof preview === 'string' ? preview : ''}
                    alt="téléchargement"
                    className="NewPost--file__image"
                  />
                  <button
                    type="button"
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
                  value="Envoyer"
                  disabled={btnDisable}
                  className="NewPost--submit-btn"
                />
                <button onClick={closeModal} className="NewPost--cancel-btn">
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeletePost}
                  className="NewPost--delete-btn"
                >
                  Supprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPost;
