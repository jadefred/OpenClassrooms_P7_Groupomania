import { useEffect, FC } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import useLogStatus from '../Context';
import Cookies from 'js-cookie';
import { IPersistLogin } from '../interfaces';

//pages - components
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import NotFound from '../components/NotFound';

const App: FC = () => {
  const { auth, persistLogin } = useLogStatus();

  useEffect(() => {
    //Post access token to access route, data contains user's context
    async function getUserContext() {
      const response = await fetch('http://localhost:3000/api/auth/access', {
        method: 'POST',
        credentials: 'include',
        headers: {
          authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });
      const data: IPersistLogin = await response.json();
      return data;
    }

    //if auth is empty (refreshed the page), fetch to access endpoint to get all user data and set to context
    if (Cookies.get('accessToken') && !auth) {
      getUserContext().then((response) => {
        persistLogin(response);
      });
    }
  }, [persistLogin, auth]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={auth ? <Navigate to="/feed" /> : <Home />} />
          <Route path="/feed" element={auth ? <Feed /> : <Home />} />
          <Route path="/profile" element={auth ? <Profile /> : <Home />} />
          <Route path="*" element={auth ? <NotFound /> : <Home />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
