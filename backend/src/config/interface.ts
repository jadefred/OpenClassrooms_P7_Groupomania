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

interface IRequestBodyAccount {
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

//multer config types
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export type {
  IRequestBodyPost,
  IRequestBodyAccount,
  IUserQuery,
  IJwtPayload,
  DestinationCallback,
  FileNameCallback,
};
