const pool = require('../database/database.js');
const fs = require('fs');

exports.getAllPosts = async (req, res) => {
  try {
    //get all posts in descending order
    const allPosts = await pool.query(
      'SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id ORDER BY posts.created_at DESC'
    );

    res.status(200).json(allPosts.rows);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getOnePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const onePost = await pool.query(
      'SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id WHERE posts.post_id = $1',
      [post_id]
    );

    if (onePost.rows.length === 0) {
      res.status(404).json({ message: 'No matching post is found' });
    }

    res.status(200).json(onePost.rows[0]);
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
    const saveToDb = await pool.query(
      'INSERT INTO posts (post_id, user_id, title, content, imageUrl) VALUES(uuid_generate_v4(), $1, $2, $3, $4) RETURNING *',
      [userId, title, content, imageUrl]
    );

    if (saveToDb.rows.length === 0) {
      res.status(500).json({ message: 'failed to save data in database' });
    }

    res.status(201).json({ message: 'Created a post' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifyPost = async (req, res) => {
  try {
    let imageUrl = null;
    const { postId, userId, title, content, image } = req.body;

    //query to get saved imageUrl
    const imageInDB = await pool.query(
      'SELECT imageUrl FROM posts WHERE post_id = $1',
      [postId]
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

    //When user has uploaded an image
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

      //If imageUrl in DB is not null, call function to delete old image
      if (imageInDB.rows[0].imageurl) {
        deleteImage(imageInDB.rows[0].imageurl.split('/').pop());
      }

      //Update DB
      const updatePost = await pool.query(
        'UPDATE posts SET title = $1, content = $2, imageUrl = $3 WHERE post_id = $4 AND user_id = $5 RETURNING *',
        [title, content, imageUrl, postId, userId]
      );
      if (updatePost.rows.length === 0) {
        res.status(500).json({ error });
      }
      res
        .status(200)
        .json({ message: "Successfully updated post's content and image" });
    }
    //no image is uploaded, user might or might not deleted old image
    else {
      //if req.body.image is an empty string, it means user deleted the image, call function to remove image from DB
      if (!image && imageInDB.rows[0].imageurl) {
        deleteImage(imageInDB.rows[0].imageurl.split('/').pop());
      }

      //update DB
      const updatePost = await pool.query(
        'UPDATE posts SET title = $1, content = $2, imageUrl = $3 WHERE post_id = $4 AND user_id = $5 RETURNING *',
        [title, content, image, postId, userId]
      );

      if (updatePost.rows.length === 0) {
        res.status(500).json({ error });
      }

      res.status(200).json({ message: "Successfully updated post's content" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    //delete all comments related to the post (table of comment used post_id as foreign keys)
    await pool.query('DELETE FROM comments WHERE post_id = $1 RETURNING *', [
      postId,
    ]);

    const deletePost = await pool.query(
      'DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING *',
      [postId, userId]
    );

    if (deletePost.rows.length === 0) {
      return res.status(404).json({ message: 'No related post is found' });
    }

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

    if (deletePost.rows[0].imageurl !== null) {
      console.log('entered delete image block');
      deleteImage(deletePost.rows[0].imageurl.split('/').pop());
    }

    res.status(204).json({ message: 'Post deleted' });
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
      'SELECT post_id FROM posts WHERE $1 = ANY(likeUserId) AND post_id = $2',
      [userId, post_id]
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

//create comment
exports.createComment = async (req, res) => {
  try {
    let imageUrl = null;
    const { postId, userId, content } = req.body;

    //if user has sent file, create url for the image
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    }

    //save all data into database, content and imageUrl could be empty string or null
    const commentToDB = await pool.query(
      'INSERT INTO comments (comment_id,user_id, post_id, commentBody, imageUrl) VALUES(uuid_generate_v4(), $1, $2, $3, $4) RETURNING *',
      [userId, postId, content, imageUrl]
    );

    if (commentToDB.rows.length === 0) {
      res.status(500).json({ message: 'failed to save comment into database' });
    }

    //push comment_id to posts commentId array
    const pushToPost = await pool.query(
      'UPDATE posts SET commentId = array_append(commentId, $1), totalComment = (totalComment + 1) WHERE post_id = $2 RETURNING *',
      [commentToDB.rows[0].comment_id, postId]
    );

    if (pushToPost.rows.length === 0) {
      //if failed to insert comment id to the post, delete the comment then throw error
      await pool.query('DELETE FROM comments WHERE comment_id = $1', [
        commentToDB.rows[0].comment_id,
      ]);
      res
        .status(500)
        .json({ message: 'failed to insert comment id to the related post' });
    }

    res.status(201).json({ message: 'Created a comment' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//get all related comments
exports.getAllComments = async (req, res) => {
  try {
    const post_id = req.params.id;
    const relatedComments = await pool.query(
      'SELECT (comments).*, users.username, users.avatar_url FROM comments JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = $1',
      [post_id]
    );

    if (relatedComments.rows.length === 0) {
      res.status(500).json({ message: 'failed get related comments' });
    }

    res.status(200).json(relatedComments.rows);
  } catch (error) {
    res.status(500).json({ error });
  }
};
