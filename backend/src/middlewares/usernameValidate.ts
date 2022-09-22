import { Request, Response, NextFunction } from 'express';

interface IBody {
  username: string;
}
//middleware to check username, throw error when username is empty or violated the requirement
//username can containe only uppercase, lowercase letter, number and underscore, between 3 & 30 characters
const usernameValidator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username }: IBody = req.body;
    const regexUsername = /[\w]{3,30}$/;

    if (!username || !regexUsername.test(username)) {
      throw 'Username is not valide';
    }

    next();
  } catch (error) {
    let message: Error | string;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(401).json({ message });
  }
};

export default usernameValidator;
