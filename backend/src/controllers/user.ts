import { Request, Response } from 'express';
import { QueryResult, QueryResultRow } from 'pg';
import pool from '../database/database';
import fs from 'fs';

interface IRequestBody {
  username: string;
  image: string;
  userId: string
}

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user_id: string = req.params.id;

    const userInfo: QueryResult<QueryResultRow> = await pool.query(
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

export const modifyUserInfo = async (req: Request, res: Response) => {
  try {
    const user_id: string = req.params.id;
    let avatarUrl: string | null = null;
    const { username, image }: IRequestBody = req.body;

    //check username validity
    const userNameRegex: RegExp = /[a-zA-Z0-9_éèçàÉÈÇÀîÎïÏùÙ]{3,30}$/;
    if (
      username.length < 3 ||
      username.length > 30 ||
      !userNameRegex.test(username)
    ) {
      return res.status(401).json({ error: 'Username invalide' });
    }

    //query to get saved imageUrl
    const avatarInDB: QueryResult<QueryResultRow> = await pool.query(
      'SELECT avatar_url FROM users WHERE user_id = $1',
      [user_id]
    );

    //function to delete uploaded image by its file name
    function deleteImage(url: string) {
      fs.unlink(`src/image/${url}`, (err) => {
        if (err) {
          console.log('failed to delete local image:' + err);
        } else {
          console.log('successfully deleted local image');
        }
      });
    }

    //When user has uploaded an avatar
    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;

      //If imageUrl in DB is not null, call function to delete old image
      if (avatarInDB.rows[0].avatar_url) {
        deleteImage(avatarInDB.rows[0].avatar_url.split('/').pop());
      }

      //Update DB
      const updateUser: QueryResult<QueryResultRow> = await pool.query(
        'UPDATE users SET username = $1, avatar_url = $2 WHERE user_id = $3 RETURNING *',
        [username, avatarUrl, user_id]
      );
      if (updateUser.rows.length === 0) {
        res.status(500).json({ error: 'no result is found' });
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
      const updateUser: QueryResult<QueryResultRow> = await pool.query(
        'UPDATE users SET username = $1, avatar_url = $2 WHERE user_id = $3 RETURNING *',
        [username, image, user_id]
      );

      if (updateUser.rows.length === 0) {
        res.status(500).json({ error: 'no result is found' });
      }

      res.status(200).json({ message: "Successfully updated user's profile" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId }: IRequestBody = req.body;

    //function to delete uploaded image by its file name
    function deleteImage(url: string) {
      fs.unlink(`src/image/${url}`, (err) => {
        if (err) {
          console.log('failed to delete local image:' + err);
        } else {
          console.log('successfully deleted local image');
        }
      });
    }

    //delete all related comments, and get all comments' id
    const deleteUserComment: QueryResult<QueryResultRow> = await pool.query(
      'DELETE FROM comments WHERE user_id = $1 RETURNING *',
      [userId]
    );

    //use result of deleteComment, loop through post id and related comment id in order to update comment id array and total comment count in the table of posts
    if (deleteUserComment.rows.length > 0) {
      for (const i of deleteUserComment.rows) {
        await pool.query(
          'UPDATE posts SET commentId = array_remove(commentId, $1), totalComment = (totalComment - 1) WHERE post_id = $2;',
          [i.comment_id, i.post_id]
        );

        //if imageurl in comment is not null or empty, call delete local image function
        if (i.imageurl) {
          deleteImage(i.imageurl.split('/').pop());
        }
      }
    }

    //delete all likes that user has gave
    await pool.query(
      'UPDATE posts SET likeUserId = array_remove(likeUserId, $1), likes = (likes - 1) WHERE $1 = ANY(likeUserId)',
      [userId]
    );

    //get all post id that user created
    const allPostOfUser: QueryResult<QueryResultRow> = await pool.query(
      'SELECT post_id FROM posts WHERE user_id = $1',
      [userId]
    );

    //if the posts have comments, delete them all
    if (allPostOfUser.rows.length > 0) {
      for (const i of allPostOfUser.rows) {
        await pool.query(
          'DELETE FROM comments WHERE post_id = $1 RETURNING *',
          [i.post_id]
        );
      }
    }

    //delete all posts which related to user
    const deleteAllPost: QueryResult<QueryResultRow> = await pool.query(
      'DELETE FROM posts WHERE user_id = $1 RETURNING *',
      [userId]
    );

    //loop through all posts, if imageurl is not null nor empty, call delete image function
    if (deleteAllPost.rows.length > 0) {
      for (const i of deleteAllPost.rows) {
        if (i.imageurl) {
          deleteImage(i.imageurl.split('/').pop());
        }
      }
    }

    //delete user profile picture if any
    const avatarInDB: QueryResult<QueryResultRow> = await pool.query(
      'SELECT avatar_url FROM users WHERE user_id = $1',
      [userId]
    );

    //If imageUrl in DB is not null, call function to delete old image
    if (avatarInDB.rows[0].avatar_url) {
      deleteImage(avatarInDB.rows[0].avatar_url.split('/').pop());
    }

    //delete user account
    await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [
      userId,
    ]);

    res.status(204).json({ message: 'Successfully deleted user' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
