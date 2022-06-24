const pool = require('../database/database.js');

exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await pool.query(
      'SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id;'
    );

    if (allPosts.rows.length === 0) {
      res.status(500).json({ error });
    }

    res.status(200).json(allPosts.rows);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.createPost = async (req, res) => {
  try {
    let imageUrl = null;
    const { userId, title, content } = req.body;

    //if user has sent file, create url for the image
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    }

    //save all data into database, content and imageUrl could be empty string or null
    await pool.query(
      'INSERT INTO posts (post_id, user_id, title, content, imageUrl) VALUES(uuid_generate_v4(), $1, $2, $3, $4)',
      [userId, title, content, imageUrl]
    );

    res.status(201).json({ message: 'Created a post' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//like post
exports.likePost = async (req, res) => {
  try {
    const { userId, post_id, like } = req.body;

    //query to check if user's id is in the array
    const hasLiked = await pool.query(
      'SELECT post_id FROM posts WHERE $1 = ANY(likeUserId)',
      [userId]
    );

    switch (like) {
      //retrieve like request
      case 0:
        //if no id is found in the array, send error message
        if (hasLiked.rows.length === 0) {
          return res
            .status(404)
            .json({ message: "User didn't like this post" });
        }

        //if it's good, remove user's id from array and number of like minus 1
        await pool.query(
          'UPDATE posts SET likeUserId = array_remove(likeUserId, $1), likes = (likes - 1) WHERE post_id = $2',
          [userId, post_id]
        );
        res.status(200).json({ message: 'Removed the like from this post' });
        break;

      //like post request
      case 1:
        //if id is already existed, return request
        if (hasLiked.rows.length !== 0) {
          return res
            .status(409)
            .json({ message: 'User has already liked this post' });
        }

        //if it's good, add user's id from array and number of like plus 1
        await pool.query(
          'UPDATE posts SET likeUserId = array_append(likeUserId, $1), likes = (likes + 1) WHERE post_id = $2',
          [userId, post_id]
        );
        res.status(200).json({ message: 'Liked this post' });
        break;
      default:
        res.status(406).json({ error: 'Undefined action' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
