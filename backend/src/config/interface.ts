interface IRequestBodyPost {
  userId: string;
  title: string;
  content: string;
  postId: string;
  image: string;
  like: number;
  commentId: string;
  username: string;
}

interface IResponseBodyAccount {
  username: string;
  email: string;
  password: string;
}

interface IUserQuery {
  userId: string;
  username: string;
  admin: boolean;
  avatarUrl: string;
}

interface IJwtPayload {
  userId: string;
}

export type { IRequestBodyPost, IResponseBodyAccount, IUserQuery, IJwtPayload };
