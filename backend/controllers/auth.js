const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../database/database.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check email validity
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      res.status(401).json({ error: 'Email is invalid' });
    }

    //hash password before save to DB
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      'INSERT INTO users (user_id, username, email, pw_hashed) VALUES(uuid_generate_v4(), $1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Signup success' });
  } catch (error) {
    //unique_violation error
    if (error.code === '23505') {
      res.status(409).json({ message: 'This email has already used' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const userId = user.rows[0].user_id;
    const { username, admin } = user.rows[0];
    const avatarUrl = user.rows[0].avatar_url;

    const assessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
      expiresIn: '2s',
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
      expiresIn: '365d',
    });
    await pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [
      refreshToken,
      email,
    ]);

    //send userId, username, accesstoken, admin and avatar_url to frontend
    res
      .status(200)
      .json({ _id: userId, username, token: assessToken, admin, avatarUrl });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.auth = async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    //get userId from jwt
    const decodedUserId = jwt.decode(token).userId;
    //return when no access token is found
    if (!token) {
      res.status(401).json({ error: 'No authentication token is found' });
    }

    //verify access token
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
      //when error is found, call function to validate refresh token which saved in database
      if (err) {
        valdidateRefreshToken(decodedUserId);
      } else {
        //return user data
        const userInfo = await pool.query(
          'SELECT user_id, username, admin, avatar_url FROM users WHERE user_id=$1',
          [decodedUserId]
        );

        res.status(200).json(userInfo.rows[0]);
      }
    });

    //function to validate refresh token
    async function valdidateRefreshToken(id) {
      //search from databse
      const hasRefreshToken = await pool.query(
        'SELECT refresh_token FROM users WHERE user_id=$1',
        [id]
      );

      //if no refresh token in the database, send failed status
      if (hasRefreshToken.rows.length === 0)
        return res.status(403).json({ error: 'Authentication failed' });

      const refreshToken = hasRefreshToken.rows[0].refresh_token;
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, token) => {
          //if error is detected, throw fail status code
          if (err) {
            return res.status(403).json({ error: 'Authentication failed' });
          }

          //if verification is good, send new access token to front end
          const assessToken = jwt.sign(
            { userId: id },
            process.env.ACCESS_TOKEN,
            {
              expiresIn: '30m',
            }
          );

          const userInfo = await pool.query(
            'SELECT user_id, username, admin, avatar_url FROM users WHERE user_id=$1',
            [id]
          );

          res.status(200).json({ token: assessToken, ...userInfo.rows[0] });
        }
      );
    }
  } catch (error) {
    res.status(403).json({ error: 'Authentication failed' });
  }
};
