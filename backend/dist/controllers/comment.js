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
//create comment
exports.createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrl = null;
        const { postId, userId, content } = req.body;
        //send bad request if comment body is over 255 characters
        const wordCount = content === null || content === void 0 ? void 0 : content.split('').length;
        if (wordCount > 255) {
            return res
                .status(400)
                .json({ message: 'Content is move than 255 characters' });
        }
        //if user has sent file, create url for the image
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        }
        //save all data into database, content and imageUrl could be empty string or null
        const commentToDB = yield pool.query('INSERT INTO comments (comment_id,user_id, post_id, commentBody, imageUrl) VALUES(uuid_generate_v4(), $1, $2, $3, $4) RETURNING *', [userId, postId, content, imageUrl]);
        if (commentToDB.rows.length === 0) {
            res.status(500).json({ message: 'failed to save comment into database' });
        }
        //push comment_id to posts commentId array
        const pushToPost = yield pool.query('UPDATE posts SET commentId = array_append(commentId, $1), totalComment = (totalComment + 1) WHERE post_id = $2 RETURNING *', [commentToDB.rows[0].comment_id, postId]);
        if (pushToPost.rows.length === 0) {
            //if failed to insert comment id to the post, delete the comment then throw error
            yield pool.query('DELETE FROM comments WHERE comment_id = $1', [
                commentToDB.rows[0].comment_id,
            ]);
            res
                .status(500)
                .json({ message: 'failed to insert comment id to the related post' });
        }
        res.status(201).json({ message: 'Created a comment' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
//get all related comments
exports.getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = req.params.id;
        const relatedComments = yield pool.query('SELECT (comments).*, users.username, users.avatar_url FROM comments JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = $1 ORDER BY comments.created_at DESC', [post_id]);
        if (relatedComments.rows.length === 0) {
            console.log('No comment has found');
            return res.status(200).json({ message: 'No comment has found' });
        }
        res.status(200).json(relatedComments.rows);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
//delete comment
exports.deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, userId, postId } = req.body;
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
        //image url of comment
        const imageUrl = yield pool.query('SELECT imageUrl FROM comments WHERE comment_id = $1', [commentId]);
        //see if user is admin
        const isUserAdmin = yield pool.query('SELECT admin FROM users WHERE user_id = $1', [userId]);
        //if user is admin, delete comment anyway
        if (isUserAdmin.rows[0].admin) {
            //delete comment by comment id
            const adminDeleteComment = yield pool.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [commentId]);
            if (adminDeleteComment.rows.length === 0) {
                res.status(500).json({ error });
            }
        }
        //if user is not admin, verify his user id, allow when is him created the comment
        else {
            //delete comment by comment id
            const userDeleteComment = yield pool.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [commentId]);
            if (userDeleteComment.rows.length === 0) {
                return res.status(500).json({ message: 'No comment is found' });
            }
        }
        //delete local saved image of comment
        if (imageUrl.rows[0].imageurl) {
            deleteImage(imageUrl.rows[0].imageurl.split('/').pop());
        }
        //update total number of comment from post by post id
        const updateNumOfComment = yield pool.query('UPDATE posts SET totalComment = (totalComment - 1) WHERE post_id = $1 RETURNING *', [postId]);
        if (updateNumOfComment.rows.length === 0) {
            res.status(500).json({ error });
        }
        res.status(204).json({ message: 'Comment deleted' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
