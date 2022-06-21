const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const accessTokenSecretKey = process.env.ACCESS_TOKEN;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authentication'];
    const token = authHeader && authHeader.split('')[1];

    if (!token)
      return res
        .status(401)
        .json({ error: 'No authentication token is found' });

    jwt.verify(token, accessTokenSecretKey, (err, user) => {
      if (err) return res.status(403).json({ error: 'Authentication failed' });
      next();
    });
  } catch (error) {
    res.status(403).json({ error: 'Authentication failed' });
  }
};
