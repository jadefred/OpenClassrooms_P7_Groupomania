const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');

//controller
const postCtrl = require('../controllers/post.js');

//routes
router.get('/', postCtrl.getAllPosts);
router.post('/', multer, postCtrl.createPost);

module.exports = router;
