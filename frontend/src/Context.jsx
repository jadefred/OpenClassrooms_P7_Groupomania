import { createContext, useState } from 'react'

export const UserContext = createContext({ userId: '', auth: false })

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: '', auth: false })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
