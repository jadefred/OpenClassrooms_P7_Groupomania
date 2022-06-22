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
      res.status(401).json({ error: 'User not exist' });
    }

    console.log(user.rows[0]);

    //compare req body password and hashed password which saved in DB
    const match = await bcrypt.compare(password, user.rows[0].pw_hashed);
    if (!match) {
      return res.status(401).json({ error: 'Password incorrect' });
    }

    const userId = user.rows[0].user_id;
    const { username, admin } = user.rows[0];
    const avatarUrl = user.rows[0].avatar_url;

    const assessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
      expiresIn: '30m',
    });
    //const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN);

    res
      .status(200)
      .json({ _id: userId, username, token: assessToken, admin, avatarUrl });
  } catch (error) {
    console.error(error);
  }
};
