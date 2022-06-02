import React, { useState, useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
//import Context from '../Context.jsx'
import { UserContext } from '../Context'

//pages - components
import Home from './Home.jsx'
import Feed from './Feed.jsx'

function App() {
  const { user, setUser } = useContext(UserContext)

  return (
    <>
        <Router>
          <Routes>
            {/* if user is logged in, redirect him to feed */}
            <Route
              path="/"
              element={user.auth ? <Navigate to="/feed" /> : <Home />}
            />
            <Route
              path="/feed"
              element={user.auth ? <Feed /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
    </>
  )
}

export default App
