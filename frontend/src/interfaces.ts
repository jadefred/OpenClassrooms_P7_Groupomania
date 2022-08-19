interface IDispatchLogin {
  userId: string;
  username: string;
  token: string;
  admin: boolean;
  avatarUrl: string;
}

type IUserContext = {
  userId: string;
  username: string;
  auth: boolean;
  token: string;
  admin: boolean;
  avatarUrl: string;
};

type IPersistLogin = {
  user_id: string;
  username: string;
  auth: boolean;
  token: string;
  admin: boolean;
  avatarUrl: string;
};

export type { IDispatchLogin, IUserContext, IPersistLogin };
