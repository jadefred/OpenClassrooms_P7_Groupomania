import express from 'express';
const router = express.Router();
import { multerExport } from '../middlewares/multer-config';
import auth from '../middlewares/authentication';

//controller
import {
  createComment,
  getAllComments,
  deleteComment,
} from '../controllers/comment';

//comment
router.post('/comments', auth, multerExport, createComment);
router.get('/comments/:id', auth, getAllComments);
router.delete('/comments', auth, deleteComment);

export default router;
