import { createContext, useContext, useReducer } from 'react';
import userReducer, { initialState } from './hooks/useLoginReducer';

//user information
const UserContext = createContext({ initialState });

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

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
    });
  };

  const dispatchLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const refreshContext = (userInfo) => {
    dispatch({
      type: 'PERSIST_LOGIN',
      payload: {
        userId: userInfo.user_id,
        username: userInfo.username,
        token: userInfo.token,
        admin: userInfo.admin,
        avatarUrl: userInfo.avatarUrl,
      },
    });
  };

  const keepUserInfo = (userInfo) => {
    dispatch({
      type: 'KEEP_USER_INFO',
      payload: {
        username: userInfo.username,
        avatarUrl: userInfo.avatarUrl,
      },
    });
  };

  const value = {
    userId: state.userId,
    username: state.username,
    auth: state.auth,
    token: state.token,
    admin: state.admin,
    avatarUrl: state.avatarUrl,
    dispatchLogin,
    dispatchLogout,
    keepUserInfo,
    refreshContext,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useLogStatus = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useLogStatus must be used within UserContext');
  }

  return context;
};

export default useLogStatus;
