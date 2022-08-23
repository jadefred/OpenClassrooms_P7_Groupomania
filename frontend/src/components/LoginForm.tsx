import { useRef, useState, FC } from 'react';
import { useNavigate } from 'react-router';
import { verifyToken } from '../Utils';
import useLogStatus from '../Context';
import Cookies from 'js-cookie';

const LoginForm: FC = () => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { dispatchLogin, dispatchLogout } = useLogStatus();

  function handleLogin(e: { preventDefault: () => void }) {
    e.preventDefault();

    let userInfo: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.current!.value,
        password: password.current!.value,
      }),
    };

    login();

    //async POST request - Login
    async function login() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/login',
          userInfo
        );

        //response not ok, throw error, depends on status code
        if (!response.ok) {
          if (response.status === 401) {
            setError("L'adresse mail ou le mot de passe est incorrecte.");
            throw Error('incorrect email or password');
          }
          setError("L'erreur du serveur, veuillez réessayer plus tard.");
          throw Error('server error');
        }

        const data = await response.json();
        //verify token (function from utils), return false if it is not validate
        const tokenValid = await verifyToken();
        if (tokenValid === false) {
          setError("L'authentification est expirée, veuillez se reconnecter.");
          throw Error('Access token invalid');
        }

        //object for useLogStatus hook
        const loginInfo = {
          userId: data._id,
          username: data.username,
          auth: true,
          token: Cookies.get('accessToken')!,
          admin: data.admin,
          avatarUrl: data.avatarUrl,
        };

        dispatchLogin(loginInfo);

        //redirect to feed page
        navigate('/feed');
      } catch (err) {
        //catch block, console error and display error message
        console.log(err);
        if (error === '')
          setError('Une erreur apparu, veuillez réessayer plus tard');
        dispatchLogout();
      }
    }
  }

  return (
    <>
      <div className="border-2 border-gray-500 rounded-3xl text-tertiaire">
        <form
          onSubmit={handleLogin}
          className="flex flex-col px-5 py-10 gap-y-5"
        >
          <input
            ref={email}
            type="email"
            name="loginEmail"
            placeholder="Email"
            required
            className="border border-gray-500 rounded-md py-2 px-3"
          />
          <input
            ref={password}
            type="password"
            name="loginPassword"
            placeholder="Mot de passe"
            required
            className="border border-gray-500 rounded-md py-2 px-3"
          />
          {error && <p className="text-primaire text-center">{error}</p>}
          <input
            type="submit"
            value="SE CONNECTER"
            className="bg-lightPrimary text-white font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-primaire"
          />
        </form>
      </div>
    </>
  );
};

export default LoginForm;
