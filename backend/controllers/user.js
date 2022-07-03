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

exports.modifyUserInfo = async (req, res) => {
  try {
    const user_id = req.params.id;

    let avatarUrl = null;
    const { username, image } = req.body;

    //query to get saved imageUrl
    const avatarInDB = await pool.query(
      'SELECT avatar_url FROM users WHERE user_id = $1',
      [user_id]
    );

    //function to delete uploaded image by its file name
    function deleteImage(url) {
      fs.unlink(`image/${url}`, (err) => {
        if (err) {
          console.log('failed to delete local image:' + err);
        } else {
          console.log('successfully deleted local image');
        }
      });
    }

    //When user has uploaded an avatar
    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

      //If imageUrl in DB is not null, call function to delete old image
      if (avatarInDB.rows[0].avatar_url) {
        deleteImage(avatarInDB.rows[0].avatar_url.split('/').pop());
      }

      //Update DB
      const updateUser = await pool.query(
        'UPDATE users SET username = $1, avatar_url = $2 WHERE user_id = $3 RETURNING *',
        [username, avatarUrl, user_id]
      );
      if (updateUser.rows.length === 0) {
        res.status(500).json({ error });
      }
      res.status(200).json({ message: "Successfully updated user's profile" });
    }
    //no avatar is uploaded, user might or might not deleted old image
    else {
      //if req.body.image is an empty string, it means user deleted the image, call function to remove image from DB
      if (!image && avatarInDB.rows[0].avatar_url) {
        deleteImage(avatarInDB.rows[0].avatar_url.split('/').pop());
      }

      //update DB
      const updateUser = await pool.query(
        'UPDATE users SET username = $1, avatar_url = $2 WHERE user_id = $3 RETURNING *',
        [username, image, user_id]
      );

      console.log(updateUser.rows[0]);

      if (updateUser.rows.length === 0) {
        res.status(500).json({ error });
      }

      res.status(200).json({ message: "Successfully updated user's profile" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);

    const deleteUser = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [userId]
    );

    console.log(deleteUser.rows);

    res.status(204).json({ message: 'Successfully deleted user' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
