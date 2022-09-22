import express from 'express';
const router = express.Router();
import { multerExport } from '../middlewares/multer-config';
import auth from '../middlewares/authentication';

//controller
//import postCtrl from '../controllers/post';
import {
  getAllPosts,
  createPost,
  modifyPost,
  deletePost,
  likePost,
} from '../controllers/post';

//routes
//CRUD posts
router.get('/', auth, getAllPosts);
router.post('/', auth, multerExport, createPost);
router.put('/', auth, multerExport, modifyPost);
router.delete('/', auth, deletePost);

//like
router.post('/like', likePost);

//module.exports = router;
export default router;
