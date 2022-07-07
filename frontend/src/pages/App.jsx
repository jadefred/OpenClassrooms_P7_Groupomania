import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import useLogStatus from '../Context';
import Cookies from 'js-cookie';

//pages - components
import Home from './Home.jsx';
import Feed from './Feed.jsx';
import Profile from './Profile.jsx';

function App() {
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
      const data = await response.json();
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
          <Route path="/feed" element={auth ? <Feed /> : <Navigate to="/" />} />
          <Route
            path="/profile"
            element={auth ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
