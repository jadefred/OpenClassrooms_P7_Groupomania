import { createContext, useState } from 'react'

//user information
export const UserContext = createContext({
  userId: '',
  username: 'Guest',
  auth: false,
  token: '',
  admin: false,
})

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '',
    username: '',
    auth: false,
    token: '',
    admin: false,
  })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
