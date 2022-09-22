import express from 'express';
const router = express.Router();
import { multerExport } from '../middlewares/multer-config';
import auth from '../middlewares/authentication';

//controller
import { getUserInfo, modifyUserInfo, deleteUser } from '../controllers/user';

//routes
router.get('/:id', auth, getUserInfo);
router.put('/:id', auth, multerExport, modifyUserInfo);
router.delete('/:id', auth, deleteUser);

//module.exports = router;
export default router;
