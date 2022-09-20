import express from 'express';
const router = express.Router();
import multer from '../middlewares/multer-config';
import auth from '../middlewares/authentication';

//controller
import postCtrl from '../controllers/post';

//routes
//CRUD posts
router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/', auth, multer, postCtrl.modifyPost);
router.delete('/', auth, postCtrl.deletePost);

//like
router.post('/like', postCtrl.likePost);

//module.exports = router;
export = router;
