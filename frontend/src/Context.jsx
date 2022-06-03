import { createContext, useState } from 'react'
import Cookies from 'js-cookie'

export const UserContext = createContext({ userId: '', auth: false, token: '' })

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '',
    auth: Boolean(Cookies.get('accessToken')),
    token: Cookies.get('accessToken'),
  })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
