import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import useLogStatus from '../Context';
import Cookies from 'js-cookie';
import { asyncFetch } from '../Utils';

//pages - components
import Home from './Home.jsx';
import Feed from './Feed.jsx';
import Profile from './Profile.jsx';

function App() {
  const { auth, persistLogin, keepUserInfo, refreshContext } = useLogStatus();

  useEffect(() => {
    async function getUserContext() {
      const response = await fetch('http://localhost:3000/api/auth/access', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });

      if(response.ok) {
        
      } else {
        return
      }
    }

    if (Cookies.get('accessToken')) {
      //persistLogin(Cookies.get('accessToken'));
      //refreshContext();
    }

    keepUserInfo({
      userId: JSON.parse(localStorage.getItem('userId')),
      username: JSON.parse(localStorage.getItem('username')),
      admin: JSON.parse(localStorage.getItem('admin')),
      avatarUrl: JSON.parse(localStorage.getItem('avatarUrl')),
    });
  }, []);

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
