import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const saltRounds: number = 10;
import pool from '../database/database';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { QueryResult, QueryResultRow } from 'pg';
import {
  IRequestBodyAccount,
  IUserQuery,
  IJwtPayload,
} from '../config/interface';
dotenv.config();

const accessTokenSecretKey = process.env.ACCESS_TOKEN;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN;

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: IRequestBodyAccount = req.body;

    //check username validity
    const userNameRegex = /[a-zA-Z0-9_éèçàÉÈÇÀîÎïÏùÙ]{3,30}$/;
    if (
      username.length < 3 ||
      username.length > 30 ||
      !userNameRegex.test(username)
    ) {
      return res.status(401).json({ error: 'Username invalide' });
    }

    //check email validity
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      console.log('wrong email');
      return res.status(401).json({ error: 'Email is invalid' });
    }

    //check if email has already registered, if so send 409
    const repeatedEmail = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    if (repeatedEmail.rows.length !== 0) {
      return res
        .status(409)
        .json({ error: 'This email has already registered' });
    }

    //hash password before save to DB
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      'INSERT INTO users (user_id, username, email, pw_hashed) VALUES(uuid_generate_v4(), $1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Signup success' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: IRequestBodyAccount = req.body;
    //search user by email, return email and hashed password, if no matching email is found, throw error
    const user = await pool.query(
      'SELECT user_id, username, admin, avatar_url, pw_hashed FROM users WHERE email=$1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'User not exist' });
    }

    //compare req body password and hashed password which saved in DB
    const match = await bcrypt.compare(password, user.rows[0].pw_hashed);
    if (!match) {
      return res.status(401).json({ error: 'Password incorrect' });
    }

    const userId: IUserQuery = user.rows[0].user_id;
    const { username, admin }: IUserQuery = user.rows[0];
    const avatarUrl: IUserQuery = user.rows[0].avatar_url;

    if (accessTokenSecretKey && refreshTokenSecretKey) {
      const assessToken = jwt.sign({ userId }, accessTokenSecretKey, {
        expiresIn: '30m',
      });
      const refreshToken = jwt.sign({ userId }, refreshTokenSecretKey, {
        expiresIn: '365d',
      });
      await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [
        refreshToken,
        email,
      ]);

      //send userId, username, accesstoken, admin and avatar_url to frontend
      res
        .status(200)
        .cookie('accessToken', assessToken, { maxAge: 2 * 60 * 60 * 1000 }) //cookie expire in 2 hours
        .json({ _id: userId, username, token: assessToken, admin, avatarUrl });
    }
  } catch (error) {
    let message: Error | string;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(500).json({ error: message });
  }
};

export const auth = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    //return when no access token is found
    if (!token) {
      res.status(401).json({ error: 'No authentication token is found' });
    }

    if (token && accessTokenSecretKey) {
      //get userId from jwt
      const decodedJWT = jwt.decode(token) as IJwtPayload;
      const decodedUserId = decodedJWT.userId;

      //verify access token
      jwt.verify(token, accessTokenSecretKey, async (err, user) => {
        //when error is found, call function to validate refresh token which saved in database
        if (err) {
          valdidateRefreshToken(decodedUserId);
        } else {
          //return user data
          const userInfo: QueryResult<QueryResultRow> = await pool.query(
            'SELECT user_id, username, admin, avatar_url FROM users WHERE user_id=$1',
            [decodedUserId]
          );
          res.status(200).json({ token: token, ...userInfo.rows[0] });
        }
      });
    }

    //function to validate refresh token
    async function valdidateRefreshToken(id: string) {
      //search from databse
      const hasRefreshToken: QueryResult<QueryResultRow> = await pool.query(
        'SELECT refresh_token FROM users WHERE user_id=$1',
        [id]
      );

      //if no refresh token in the database, send failed status
      if (hasRefreshToken.rows.length === 0)
        return res.status(403).json({ error: 'Authentication failed' });

      if (refreshTokenSecretKey && accessTokenSecretKey) {
        const refreshToken: string = hasRefreshToken.rows[0].refresh_token;
        jwt.verify(refreshToken, refreshTokenSecretKey, async (err) => {
          //if error is detected, throw fail status code
          if (err) {
            return res.status(403).json({ error: 'Authentication failed' });
          }

          //if verification is good, send new access token to front end
          const assessToken = jwt.sign({ userId: id }, accessTokenSecretKey, {
            expiresIn: '30m',
          });

          const userInfo: QueryResult<QueryResultRow> = await pool.query(
            'SELECT user_id, username, admin, avatar_url FROM users WHERE user_id=$1',
            [id]
          );

          res
            .status(200)
            .cookie('accessToken', assessToken, {
              maxAge: 2 * 60 * 60 * 1000,
            })
            .json({ token: assessToken, ...userInfo.rows[0] });
        });
      }
    }
  } catch (error) {
    res.status(403).json({ error: 'Authentication failed' });
  }
};
