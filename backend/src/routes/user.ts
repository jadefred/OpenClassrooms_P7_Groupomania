import express from 'express';
const router = express.Router();
import multer from '../middlewares/multer-config.js';
import auth from '../middlewares/authentication';

//controller
import userCtrl from '../controllers/user';

//routes
router.get('/:id', auth, userCtrl.getUserInfo);
router.put('/:id', auth, multer, userCtrl.modifyUserInfo);
router.delete('/:id', auth, userCtrl.deleteUser);

//module.exports = router;
export default router;
