import { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useLogStatus from '../Context';

const DeleteUser: FC = () => {
  const { dispatchLogout } = useLogStatus();
  const navigate = useNavigate();

  //2 seconds after landed on this page, user will be logged out and redirect to home page
  useEffect(() => {
    setTimeout(() => {
      Cookies.remove('accessToken');
      dispatchLogout();
      navigate('/');
    }, 2000);
  }, [dispatchLogout, navigate]);

  return (
    <>
      <div className="text-tertiaire mx-auto text-center mt-32">
        <h1 className="text-2xl mb-10">On est triste de vous voir partir</h1>
        <p className="text-xl">Ce page sera re-diregé à la page d'acceuil</p>
      </div>
    </>
  );
};

export default DeleteUser;
