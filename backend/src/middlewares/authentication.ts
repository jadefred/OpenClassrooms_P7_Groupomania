import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../database/database';
dotenv.config();

const accessTokenSecretKey = process.env.ACCESS_TOKEN;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN;

interface IJwtPayload {
  userId: string;
}

const authFunction = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('token function');
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      const decodedJWT = jwt.decode(token) as IJwtPayload;
      console.log('decodedJWT', decodedJWT);
      const decodedUserId = decodedJWT.userId;
      console.log('decodedUserID', decodedUserId);

      if (!token || token === 'undefined') {
        return res
          .status(401)
          .json({ error: 'No authentication token is found' });
      }

      jwt.verify(token, accessTokenSecretKey, (err, user) => {
        if (err) {
          valdidateRefreshToken(decodedUserId);
        } else {
          next();
        }
      });
    }

    //function to validate refresh token
    async function valdidateRefreshToken(id: string | jwt.JwtPayload) {
      //search from databse
      const hasRefreshToken = await pool.query(
        'SELECT refresh_token FROM users WHERE user_id=$1',
        [id]
      );

      //if no refresh token in the database, send failed status
      if (hasRefreshToken.rows.length === 0)
        return res.status(403).json({ error: 'Authentication failed' });

      const refreshToken = hasRefreshToken.rows[0].refresh_token;
      jwt.verify(refreshToken, refreshTokenSecretKey, async (err: any) => {
        //if error is detected, throw fail status code
        if (err) {
          return res.status(403).json({ error: 'Authentication failed' });
        }

        //if verification is good, send new access token to front end
        const assessToken = jwt.sign({ userId: id }, process.env.ACCESS_TOKEN, {
          expiresIn: '30m',
        });

        console.log('set refresh token - middleware');
        res.cookie('accessToken', assessToken);

        next();
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: 'Authentication failed' });
  }
};

export = authFunction;
