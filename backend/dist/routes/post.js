"use strict";
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/authentication');
//controller
const postCtrl = require('../controllers/post.js');
//routes
//CRUD posts
router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/', auth, multer, postCtrl.modifyPost);
router.delete('/', auth, postCtrl.deletePost);
//like
router.post('/like', postCtrl.likePost);
module.exports = router;
