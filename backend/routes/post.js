const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');

//controller
const postCtrl = require('../controllers/post.js');

//routes
//CRUD posts
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.post('/', multer, postCtrl.createPost);
router.put('/', multer, postCtrl.modifyPost);
router.delete('/', postCtrl.deletePost);

//like
router.post('/like', postCtrl.likePost);

//comment
router.post('/comments', multer, postCtrl.createComment);
router.get('/comments/:id', postCtrl.getAllComments)

module.exports = router;
