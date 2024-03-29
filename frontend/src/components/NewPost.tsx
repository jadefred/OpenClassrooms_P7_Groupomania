import React, { useState, useRef, memo, FC } from 'react';
import '../styles/newPost.css';
import useLogStatus from '../Context';

interface IProps {
  setFlashMessage: React.Dispatch<React.SetStateAction<string>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPost: FC<IProps> = ({ setFlashMessage, setRefresh }) => {
  const [modal, setModal] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [formNotComplete, setFormNotComplete] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const { userId, username, token } = useLogStatus();

  function toggleModal() {
    setModal((prev) => !prev);
    if (!modal) {
      setPreview(null);
      setImage(null);
      setFormNotComplete(false);
      setBtnDisable(true);
    }
  }

  //freeze background body from scrolling when modal is actived
  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  //enable submit button when title is detected
  function handleRefChange() {
    if (
      titleRef.current!.value !== '' &&
      (contentRef.current!.value !== '' || imageRef.current!.value !== '')
    ) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }

  //handle image input, check mime type before set to the state, set image local url as preview
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
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

  function createNewPost(e: { preventDefault: () => void }) {
    e.preventDefault();
    //pop error message if title / body content is empty and return function
    if (
      titleRef.current!.value === '' ||
      (titleRef.current!.value !== '' &&
        contentRef.current!.value === '' &&
        !image)
    ) {
      setFormNotComplete(true);
      return;
    }

    //create form data, append image when user added
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', titleRef.current!.value);
    formData.append('content', contentRef.current!.value);

    //append image if it exists
    if (image) {
      formData.append('image', image);
    }

    async function createPost() {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      });
      setModal(false);
      // flash success message if res is ok, then reset state to make it disappear
      if (response.ok) {
        setFlashMessage('Vous avez créé un post');
        setRefresh((prev) => !prev);
      }
      //fail flash message
      else {
        setFlashMessage('Un problème a apparu..');
      }
    }
    createPost();
  }

  function removeSelectedImg() {
    setImage(null);
    imageRef.current!.value = '';
    handleRefChange();
  }

  return (
    <>
      <div className="text-center flex justify-center items-center gap-x-2 sm:gap-x-10 my-8 w-11/12 md:w-3/5 mx-auto text-tertiaire">
        <p className="text-lg italic">
          {username}, partargez nous quelque chose ...
        </p>
        <button
          onClick={toggleModal}
          className="bg-tertiaire text-white font-semibold rounded-lg px-5 py-1 shadow-md shadow-gray-200"
        >
          Nouveau Post
        </button>
      </div>

      {modal && (
        <div className="NewPost--modal">
          <div onClick={toggleModal} className="NewPost--overlay"></div>
          <div className="NewPost--modal-content">
            <h2>Nouveau Post</h2>
            <form onSubmit={createNewPost}>
              <div className="formInputField">
                <label htmlFor="title">Titre : </label>
                <input
                  onChange={handleRefChange}
                  ref={titleRef}
                  type="text"
                  name="title"
                  required
                />
              </div>
              <div className="formInputField">
                <label htmlFor="content">Contenu : </label>
                <textarea
                  ref={contentRef}
                  onChange={handleRefChange}
                  name="content"
                  cols={40}
                  rows={3}
                ></textarea>
              </div>
              <div className="formInputField">
                <label htmlFor="image">Image : </label>
                <input
                  ref={imageRef}
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    handleImage(e);
                    handleRefChange();
                  }}
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
              {image && (
                <div className="NewPost--file">
                  <img
                    className="NewPost--file__image"
                    src={typeof preview === 'string' ? preview : ''}
                    alt="Téléchargement"
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
                  value="Envoyer"
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
  );
};

export default NewPost;
export const MemoizedNewPost = memo(NewPost);
