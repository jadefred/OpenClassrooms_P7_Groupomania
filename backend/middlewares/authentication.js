const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../database/database.js');
dotenv.config();

const accessTokenSecretKey = process.env.ACCESS_TOKEN;

module.exports = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const decodedUserId = jwt.decode(token).userId;

    if (!token) {
      console.log('no token is found');
      res.status(401).json({ error: 'No authentication token is found' });
    }

    jwt.verify(token, accessTokenSecretKey, (err, user) => {
      if (err) {
        valdidateRefreshToken(decodedUserId);
      } else {
        next();
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

          res.status(200).cookie('accessToken', 'Bearer ' + assessToken, {
            expires: new Date(Date.now() + 0.5 * 3600000),
          });

          next();
        }
      );
    }
  } catch (error) {
    res.status(403).json({ error: 'Authentication failed' });
  }
};
