import express from 'express';
const router = express.Router();
import { multerExport } from '../middlewares/multer-config';
import auth from '../middlewares/authentication';

//controller
import userCtrl from '../controllers/user';

//routes
router.get('/:id', auth, userCtrl.getUserInfo);
router.put('/:id', auth, multerExport, userCtrl.modifyUserInfo);
router.delete('/:id', auth, userCtrl.deleteUser);

//module.exports = router;
export default router;
