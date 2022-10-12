import { createContext, useContext, useReducer, ReactNode } from 'react';
import userReducer from './hooks/useLoginReducer';
import { IUserContext, IPersistLogin } from './interfaces';
import { UserActionKind } from './hooks/useLoginReducer';

const initialState: IUserContext = {
  userId: '',
  username: '',
  auth: false,
  token: '',
  admin: false,
  avatarUrl: '',
};

type Action = {
  userId: IUserContext['userId'];
  username: IUserContext['username'];
  auth: IUserContext['auth'];
  token: IUserContext['token'];
  admin: IUserContext['admin'];
  avatarUrl: IUserContext['avatarUrl'];
  dispatchLogin: (payload: IUserContext) => void;
  dispatchLogout: () => void;
  persistLogin: (payload: IPersistLogin) => void;
  changeUsername: (username: string) => void;
};

const UserContext = createContext({} as Action);

interface IProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const dispatchLogin = (loginInfo: IUserContext) => {
    dispatch({
      type: UserActionKind.LOGIN,
      payload: {
        userId: loginInfo.userId,
        username: loginInfo.username,
        auth: true,
        token: loginInfo.token,
        admin: loginInfo.admin,
        avatarUrl: loginInfo.avatarUrl,
      },
    });
  };

  const dispatchLogout = () => {
    dispatch({
      type: UserActionKind.LOGOUT,
      payload: {
        userId: '',
        username: '',
        auth: false,
        token: '',
        admin: false,
        avatarUrl: '',
      },
    });
  };

  const persistLogin = (userInfo: IPersistLogin) => {
    dispatch({
      type: UserActionKind.PERSIST_LOGIN,
      payload: {
        userId: userInfo.user_id,
        username: userInfo.username,
        auth: true,
        token: userInfo.token,
        admin: userInfo.admin,
        avatarUrl: userInfo.avatarUrl,
      },
    });
  };

  const changeUsername = (username: string) => {
    dispatch({
      type: UserActionKind.CHANGE_USERNAME,
      payload: { ...state, username },
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
    persistLogin,
    changeUsername,
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
