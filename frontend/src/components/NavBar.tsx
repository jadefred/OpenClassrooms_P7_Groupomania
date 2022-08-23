import { memo, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import useLogStatus from '../Context';
import whiteLogo from '../assets/logo-white.svg';

const NavBar: FC = () => {
  const { dispatchLogout } = useLogStatus();
  const navigate = useNavigate();

  function toLogout() {
    Cookies.remove('accessToken');
    dispatchLogout();
    navigate('/');
  }

  return (
    <>
      <div className="bg-primaire flex flex-col md:flex-row gap-y-3 justify-between items-center px-7 py-3">
        <Link to="/feed">
          <img src={whiteLogo} alt="Logo de Groupomania" className="w-60" />
        </Link>
        <div className="flex gap-x-5">
          <Link to="/profile">
            <button className="bg-white text-primaire text-md font-semibold rounded-lg px-5 py-1 shadow-md shadow-red-600">
              Profil
            </button>
          </Link>
          <button
            onClick={toLogout}
            className="bg-white text-primaire text-md font-semibold rounded-lg px-5 py-1 shadow-md shadow-red-600"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
};

export default NavBar;
export const MemoizedNavBar = memo(NavBar);
