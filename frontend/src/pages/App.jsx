import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import useLogStatus from '../Context'

//pages - components
import Home from './Home.jsx'
import Feed from './Feed.jsx'

function App() {
  //const { user } = useContext(UserContext)
  const { auth } = useLogStatus()

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
