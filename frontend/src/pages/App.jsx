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
          {/* if user is logged in, redirect him to feed */}
          <Route path="/" element={auth ? <Navigate to="/feed" /> : <Home />} />
          <Route path="/feed" element={auth ? <Feed /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
