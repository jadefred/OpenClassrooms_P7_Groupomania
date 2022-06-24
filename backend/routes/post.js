const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');

//controller
const postCtrl = require('../controllers/post.js');

//routes
//CRUD posts
router.get('/', postCtrl.getAllPosts);
router.post('/', multer, postCtrl.createPost);

//like
router.post('/like', postCtrl.likePost);

module.exports = router;
