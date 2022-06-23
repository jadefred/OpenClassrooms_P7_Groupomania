const pool = require('../database/database.js');

exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await pool.query('SELECT * FROM posts');

    if (allPosts.rows.length === 0) {
      res.status(500).json({ error });
    }

    res.status(200).json(allPosts.rows);
    console.log(allPosts.rows);
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
