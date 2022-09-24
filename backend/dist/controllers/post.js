"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const pool = require('../database/database');
const fs = require('fs');
exports.getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get all posts in descending order
        const allPosts = yield pool.query('SELECT (posts).*, users.username, users.avatar_url FROM posts JOIN users ON posts.user_id = users.user_id ORDER BY posts.created_at DESC');
        res.status(200).json(allPosts.rows);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrl = null;
        const { userId, title, content } = req.body;
        //if user has sent file, create url for the image
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        }
        //save all data into database, content and imageUrl could be empty string or null
        const saveToDb = yield pool.query('INSERT INTO posts (post_id, user_id, title, content, imageUrl) VALUES(uuid_generate_v4(), $1, $2, $3, $4) RETURNING *', [userId, title, content, imageUrl]);
        if (saveToDb.rows.length === 0) {
            res.status(500).json({ message: 'failed to save data in database' });
        }
        res.status(201).json({ message: 'Created a post' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.modifyPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrl = null;
        const { postId, userId, title, content, image } = req.body;
        //query to get saved imageUrl
        const imageInDB = yield pool.query('SELECT imageUrl FROM posts WHERE post_id = $1', [postId]);
        //function to delete uploaded image by its file name
        function deleteImage(url) {
            fs.unlink(`image/${url}`, (err) => {
                if (err) {
                    console.log('failed to delete local image:' + err);
                }
                else {
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
            const updatePost = yield pool.query('UPDATE posts SET title = $1, content = $2, imageUrl = $3 WHERE post_id = $4 AND user_id = $5 RETURNING *', [title, content, imageUrl, postId, userId]);
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
            if (image !== 'null') {
                imageUrl = image;
            }
            //update DB
            const updatePost = yield pool.query('UPDATE posts SET title = $1, content = $2, imageUrl = $3 WHERE post_id = $4 AND user_id = $5 RETURNING *', [title, content, imageUrl, postId, userId]);
            if (updatePost.rows.length === 0) {
                res.status(500).json({ error });
            }
            res.status(200).json({ message: "Successfully updated post's content" });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, postId } = req.body;
        //see if user is admin
        const isAdmin = yield pool.query('SELECT admin FROM users WHERE user_id = $1', [userId]);
        //is user is the OP
        const isOP = yield pool.query('SELECT user_id FROM posts WHERE post_id = $1', [postId]);
        //if user is not admin nor OP, set 401 not authorisated status
        if (!isAdmin.rows[0].admin && isOP.rows[0].user_id !== userId) {
            return res
                .status(401)
                .json({ message: 'User has no authorisation to delete this post' });
        }
        //delete all comments related to the post (table of comment used post_id as foreign keys)
        yield pool.query('DELETE FROM comments WHERE post_id = $1 RETURNING *', [
            postId,
        ]);
        const deletePost = yield pool.query('DELETE FROM posts WHERE post_id = $1 RETURNING *', [postId]);
        if (deletePost.rows.length === 0) {
            return res.status(404).json({ message: 'No related post is found' });
        }
        //function to delete uploaded image by its file name
        function deleteImage(url) {
            fs.unlink(`image/${url}`, (err) => {
                if (err) {
                    console.log('failed to delete local image:' + err);
                }
                else {
                    console.log('successfully deleted local image');
                }
            });
        }
        if (deletePost.rows[0].imageurl !== null) {
            console.log('entered delete image block');
            deleteImage(deletePost.rows[0].imageurl.split('/').pop());
        }
        res.status(204).json({ message: 'Post deleted' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
//like post
exports.likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, post_id, like } = req.body;
        //query to check if user's id is in the array
        const hasLiked = yield pool.query('SELECT post_id FROM posts WHERE $1 = ANY(likeUserId) AND post_id = $2', [userId, post_id]);
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
                yield pool.query('UPDATE posts SET likeUserId = array_remove(likeUserId, $1), likes = (likes - 1) WHERE post_id = $2', [userId, post_id]);
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
                yield pool.query('UPDATE posts SET likeUserId = array_append(likeUserId, $1), likes = (likes + 1) WHERE post_id = $2', [userId, post_id]);
                res.status(200).json({ message: 'Liked this post' });
                break;
            default:
                res.status(406).json({ error: 'Undefined action' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
