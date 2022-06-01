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
  const [loggedin, setLoggedin] = useState(true)
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
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </Router>
      </Context.Provider>
    </>
  )
}

export default App
