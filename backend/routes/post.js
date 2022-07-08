const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');
const auth = require('../middlewares/authentication');

//controller
const postCtrl = require('../controllers/post.js');

//routes
//CRUD posts
router.get('/', auth, postCtrl.getAllPosts);
//router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/', auth, multer, postCtrl.modifyPost);
router.delete('/', auth, postCtrl.deletePost);

//like
router.post('/like', postCtrl.likePost);

module.exports = router;
