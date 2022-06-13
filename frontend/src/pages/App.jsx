import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import useLogStatus from '../Context'
import Cookies from 'js-cookie'

//pages - components
import Home from './Home.jsx'
import Feed from './Feed.jsx'
import Profile from './Profile.jsx'


function App() {
  const { auth, persistLogin } = useLogStatus()

  useEffect(() => {
    if (Cookies.get('accessToken')) {
      persistLogin(Cookies.get('accessToken'))
    }
  }, [])

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
  )
}

export default App
