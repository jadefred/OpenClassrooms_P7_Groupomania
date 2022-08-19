import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import notFound from '../assets/notFound.svg';

function NotFound() {
  return (
    <>
      <NavBar />
      <div className="w-10/12 mx-auto flex flex-col items-center gap-y-10">
        <img src={notFound} alt="page introuvable" className="w-96" />
        <Link to="/feed">
          <button className="bg-tertiaire text-white px-10 py-2 text-xl rounded-lg">
            Retourner
          </button>
        </Link>
      </div>
    </>
  );
}

export default NotFound;
