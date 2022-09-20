import express from 'express';
const router = express.Router();
import multer from '../middlewares/multer-config';
import auth from '../middlewares/authentication';

//controller
import commentCtrl from '../controllers/comment';

//comment
router.post('/comments', auth, multer, commentCtrl.createComment);
router.get('/comments/:id', auth, commentCtrl.getAllComments);
router.delete('/comments', auth, commentCtrl.deleteComment);

//module.exports = router;
export default router;
