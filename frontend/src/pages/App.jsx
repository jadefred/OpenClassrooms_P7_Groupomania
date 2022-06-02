import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Context from '../Context.jsx'

//pages - components
import Home from './Home.jsx'
import Feed from './Feed.jsx'

function App() {
  //search LS to set initial loggedin state
  const [loggedin, setLoggedin] = useState(
    Boolean(localStorage.getItem('authentication'))
  )

  return (
    <>
      <Context.Provider value={{ loggedin, setLoggedin }}>
        <Router>
          <Routes>
            {/* if user is logged in, redirect him to feed */}
            <Route
              path="/"
              element={loggedin ? <Navigate to="/feed" /> : <Home />}
            />
            <Route
              path="/feed"
              element={loggedin ? <Feed /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
      </Context.Provider>
    </>
  )
}

export default App
