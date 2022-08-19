import { IUserContext } from '../interfaces';

// An enum with all the types of actions to use in our reducer
enum UserActionKind {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PERSIST_LOGIN = 'PERSIST_LOGIN',
  CHANGE_USERNAME = 'CHANGE_USERNAME',
}

export const initialState: IUserContext = {
  userId: '',
  username: '',
  auth: false,
  token: '',
  admin: false,
  avatarUrl: '',
};

// An interface for our actions
interface UserAction {
  type: UserActionKind;
  payload: IUserContext;
}

const userReducer = (state: IUserContext, action: UserAction) => {
  const { type, payload } = action;

  switch (type) {
    case UserActionKind.LOGIN:
      return {
        ...state,
        userId: payload.userId,
        username: payload.username,
        auth: true,
        token: payload.token,
        admin: payload.admin,
        avatarUrl: payload.avatarUrl,
      };

    case UserActionKind.LOGOUT:
      return {
        ...state,
        userId: '',
        username: '',
        auth: false,
        token: '',
        admin: false,
        avatarUrl: '',
      };

    case UserActionKind.PERSIST_LOGIN:
      return {
        ...state,
        userId: payload.userId,
        username: payload.username,
        auth: true,
        token: payload.token,
        admin: payload.admin,
        avatarUrl: payload.avatarUrl,
      };

    case UserActionKind.CHANGE_USERNAME:
      return {
        ...state,
        username: payload.username,
      };

    default:
      throw new Error(`No case for type ${type} found in shopReducer.`);
  }
};

export default userReducer;
