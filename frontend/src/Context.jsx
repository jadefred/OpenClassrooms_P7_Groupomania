import { createContext, useState } from 'react'
import Cookies from 'js-cookie'

export const UserContext = createContext({
  userId: '',
  username: '',
  auth: false,
  token: '',
  admin: false,
})

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    auth: Boolean(Cookies.get('accessToken')),
    token: Cookies.get('accessToken'),
    admin: false,
  })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
