const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../database/database.js');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

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
      'INSERT INTO users (username, email, pw_hashed) VALUES($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(200).json({ message: 'Signup success' });
  } catch (error) {
    //unique_violation error
    if (error.code === '23505') {
      res.status(409).json({ message: 'This email has already used' });
    }
    res.status(500).json({ error: error.message });
  }
};
