export const initialState = {
  userId: '',
  username: '',
  auth: false,
  token: '',
  admin: false,
  avatarUrl: '',
};

const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        userId: payload.userId,
        username: payload.username,
        auth: true,
        token: payload.token,
        admin: payload.admin,
        avatarUrl: payload.avatarUrl,
      };

    case 'LOGOUT':
      return {
        ...state,
        userId: '',
        username: '',
        auth: false,
        token: '',
        admin: false,
        avatarUrl: '',
      };

    case 'PERSIST_LOGIN':
      return {
        ...state,
        userId: payload.userId,
        username: payload.username,
        auth: true,
        token: payload.token,
        admin: payload.admin,
        avatarUrl: payload.avatarUrl,
      };

    default:
      throw new Error(`No case for type ${type} found in shopReducer.`);
  }
};

export default userReducer;
