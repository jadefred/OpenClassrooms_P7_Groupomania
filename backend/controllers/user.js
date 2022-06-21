const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../database/database.js');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newSignup = await pool.query(
      'INSERT INTO users (username, email, pw_hashed) VALUES($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.json(newSignup);
  } catch (error) {
    console.log('this is error block');

    //unique_violation error
    if (error.code === 23505) {
      res.status(409).json({ message: 'This email has already used' });
    }
  }
};
