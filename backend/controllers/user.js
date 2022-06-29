const pool = require('../database/database.js');
const fs = require('fs');

exports.getUserInfo = async (req, res) => {
  try {
    const user_id = req.params.id;

    const userInfo = await pool.query(
      'SELECT username, avatar_url, email, admin FROM users WHERE user_id = $1',
      [user_id]
    );

    if (userInfo.rows.length === 0) {
      res.status(404).json({ message: 'No matched user is found' });
    }

    res.status(200).json(userInfo.rows[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};
