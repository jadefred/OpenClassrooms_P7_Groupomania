const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');

//controller
const commentCtrl = require('../controllers/comment.js');

//comment
router.post('/comments', multer, commentCtrl.createComment);
router.get('/comments/:id', commentCtrl.getAllComments);
router.delete('/comments', commentCtrl.deleteComment);

module.exports = router;
