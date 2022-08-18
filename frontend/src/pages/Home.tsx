import React, { useState, FC } from 'react';

//components
import HomeNavBar from '../components/HomeNavBar';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import logoOrange from '../assets/logo-orange.svg';

const Home: FC = () => {
  const [guest, setGuest] = useState<boolean>(false);
  return (
    <>
      <HomeNavBar guest={guest} setGuest={setGuest} />
      <div className="flex flex-col md:flex-row px-10 md:px-24 gap-x-20 mt-20">
        <div className="basis-1/2 md:self-center">
          <img
            src={logoOrange}
            alt="Logo de groupomania"
            className="mx-auto w-auto md:mx-0"
          />
          <h1 className="text-2xl text-center md:text-left md:text-4xl font-bold text-tertiaire mt-10 mb-10 md:mb-0">
            Partagez et restez en contact avec vos colleagues.
          </h1>
        </div>
        <div className="basis-1/2">
          {guest ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </>
  );
}

export default Home;
