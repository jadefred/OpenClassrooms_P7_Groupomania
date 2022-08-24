const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/authentication');

//controller
const commentCtrl = require('../controllers/comment');

//comment
router.post('/comments', auth, multer, commentCtrl.createComment);
router.get('/comments/:id', auth, commentCtrl.getAllComments);
router.delete('/comments', auth, commentCtrl.deleteComment);

module.exports = router;
