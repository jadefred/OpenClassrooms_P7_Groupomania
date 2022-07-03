import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import defaultProfil from '../assets/defaultProfil.svg';
import { asyncFetch } from '../Utils';

//custom hooks
import useFetch from '../hooks/useFetch';
import useLogStatus from '../Context';
import Loading from '../components/Loading.jsx';

function UserProfile({ setFlashMessage, setDeleteAccount }) {
  const imageRef = useRef();
  const { userId, token } = useLogStatus();
  const { data, isLoaded, error } = useFetch(
    `http://localhost:3000/api/user/${userId}`
  );
  const [image, setImage] = useState(null);
  const [formNotComplete, setFormNotComplete] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);
  const [input, setInput] = useState({
    username: '',
    email: '',
    avatarUrl: '',
    admin: false,
  });

  //once fetch's data is loaded, update state
  useEffect(() => {
    if (data) {
      setInput({
        username: data.username,
        avatarUrl: data.avatar_url,
        email: data.email,
        admin: data.admin,
      });
    }
  }, [data]);

  //update username state
  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setBtnDisable(false);
    //remove warning message when user entred something in the field of username
    if (input.username !== '') {
      setFormNotComplete(false);
    }
  };

  //handle image input, check mime type before set to the state
  function handleImage(e) {
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
        setInput({ ...input, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
      setBtnDisable(false);
    } else {
      setImage(null);
    }
  }

  //remove selected image / the image from server
  function removeSelectedImg() {
    setImage(null);
    setInput({ ...input, avatarUrl: '' });
    setBtnDisable(false);
  }

  function handleUserAccount(e) {
    e.preventDefault();

    //pop error message if title / body content is empty and return function
    if (input.username === '') {
      setFormNotComplete(true);
      return;
    }

    //create form data, append image when user added
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('username', input.username);

    //append image if it exists
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('image', input.avatarUrl);
    }

    //async function from Utils to do POST request
    //last argument (true) represents this fetch will passing file, asyncFetch will change headers accordingly
    //assign flashMessage based on the response
    asyncFetch(
      `http://localhost:3000/api/user/${userId}`,
      'PUT',
      token,
      formData,
      true
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('rejected by server');
        }
        setFlashMessage('Vous avez modifié votre profil');
        setBtnDisable(true);
      })
      .catch((err) => {
        console.log(err);
        setFlashMessage('Un problème a apparu..');
      });
  }

  //pop up confirm block, setDeleteAccount as true, page will render DeleteUser component
  //if fetch not success, it will stay in same page and prompt flash error message in the same component
  function deleteUser() {
    if (window.confirm('Vous êtes sûr de supprimer ce post ?')) {
      asyncFetch(
        `http://localhost:3000/api/user/${userId}`,
        'DELETE',
        token,
        JSON.stringify({ userId: userId })
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('rejected by server');
          }
          setDeleteAccount(true);
        })
        .catch((err) => {
          console.log(err);
          setFlashMessage('Un problème a apparu..');
        });
    } else {
      return;
    }
  }

  return (
    <>
      {/* Loading page */}
      {!isLoaded && <Loading />}

      {/* Error page */}
      {error && isLoaded && (
        <h2 className="text-tertiaire text-center text-4xl py-52">
          Un problème apparu... Veuillez re-essayez plus tard
        </h2>
      )}

      {/* Profile page when no error and loading is finished */}
      {!error && isLoaded && (
        <div className="w-4/5 mx-auto">
          <form
            onSubmit={handleUserAccount}
            className="flex flex-col mt-12 md:mt-24 gap-y-5"
          >
            <div className="flex flex-col gap-y-6 md:flex-row justify-center items-center gap-x-8">
              {/* image, add photo button and delete image button block */}
              <div className="flex flex-col gap-y-3">
                {/* if avatarUrl is not empty, display image. Display default svg profile picture when avatarUrl is empty */}
                {input.avatarUrl ? (
                  <img
                    src={input.avatarUrl}
                    alt="l'avatar d'utilisateur"
                    className="w-40 h-40 object-cover rounded-full"
                  />
                ) : (
                  <img
                    src={defaultProfil}
                    alt="l'avatar d'utilisateur"
                    className="w-40 h-40 object-cover rounded-full"
                  />
                )}
                <input
                  ref={imageRef}
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImage}
                  className="hidden"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    imageRef.current.click();
                  }}
                  className="bg-tertiaire text-white px-2 py-1 rounded-md w-40"
                >
                  Choisir une image
                </button>

                {/* button to remove avatar or selected image, hide when no url is found */}
                {input.avatarUrl ? (
                  <button
                    type="button"
                    onClick={removeSelectedImg}
                    className="bg-tertiaire text-white px-2 py-1 rounded-md w-40"
                  >
                    Supprimer l'image
                  </button>
                ) : (
                  <></>
                )}
              </div>

              {/* username, email, type of account block */}
              <div className="text-tertiaire flex flex-col gap-y-5">
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="username" className="font-semibold text-lg">
                    Nom d'utilisateur :{' '}
                  </label>
                  <input
                    onChange={handleInput}
                    type="text"
                    name="username"
                    value={input.username}
                    className="border-2 border-secondaire px-2 py-1 rounded-lg"
                  />
                </div>

                <div className="flex gap-x-5 items-center">
                  {/* email input field can't be modified, display address only */}
                  <label htmlFor="email" className="font-semibold text-lg">
                    L'adresse mail :{' '}
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={input.email}
                    disabled
                    className="border-2 border-secondaire px-2 py-1 rounded-lg disabled:bg-secondaire"
                  />
                </div>

                <div className="flex gap-x-5 items-center">
                  {/* user data will decide p value - admin / normal user */}
                  <p className="font-semibold text-lg">Type de compte : </p>
                  {input.admin ? <p>Administrateur</p> : <p>Utilisateur</p>}
                </div>
              </div>
            </div>

            {/* warning message pops up when form is username is empty */}
            {formNotComplete && (
              <p className="text-primaire text-center text-lg">
                Veuillez saisir un nom d'utilisateur
              </p>
            )}

            {/* button block */}
            <div className="flex flex-col md:flex-row justify-center gap-x-12 gap-y-4">
              {/* buttons to submit, disable by default when no change is detected. return button back to feed */}
              <input
                type="submit"
                value="Modifier"
                disabled={btnDisable}
                className="disabled:bg-gray-300 bg-emerald-700 text-white px-8 py-1 rounded-lg"
              />

              <Link to="/feed">
                <button
                  type="button"
                  className="bg-tertiaire text-white px-8 py-1 rounded-lg w-full md:w-auto"
                >
                  Retourner
                </button>
              </Link>

              <button
                onClick={deleteUser}
                type="button"
                className="bg-primaire text-white px-8 py-1 rounded-lg"
              >
                Supprimer Compte
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default UserProfile;
