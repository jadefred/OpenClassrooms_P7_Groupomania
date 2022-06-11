import { createContext, useContext, useReducer } from 'react'
import userReducer, { initialState } from './useLoginReducer'

//user information
const UserContext = createContext({ initialState })

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const dispatchLogin = (loginInfo) => {
    dispatch({
      type: 'LOGIN',
      payload: {
        userId: loginInfo.userId,
        username: loginInfo.username,
        token: loginInfo.token,
        admin: loginInfo.admin,
        avatarUrl: loginInfo.avatarUrl,
      },
    })
  }

  const dispatchLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    userId: state.userId,
    username: state.username,
    auth: state.auth,
    token: state.token,
    admin: state.admin,
    avatarUrl: state.avatarUrl,
    dispatchLogin,
    dispatchLogout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useLogStatus = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useLogStatus must be used within UserContext')
  }

  return context
}

export default useLogStatus
