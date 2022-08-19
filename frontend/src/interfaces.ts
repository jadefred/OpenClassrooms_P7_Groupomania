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

interface IDataFeed {
  avatar_url: string;
  commentid: string[];
  content: string;
  created_at: string;
  imageurl: string | null;
  likes: number;
  likeuserid: string[];
  post_id: string;
  title: string;
  totalcomment: number;
  user_id: string;
  username: string;
}

export type { IDispatchLogin, IUserContext, IPersistLogin, IDataFeed };
