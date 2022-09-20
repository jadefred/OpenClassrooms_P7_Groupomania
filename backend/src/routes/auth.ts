import express from 'express';
const router = express.Router();

//controller
import userCtrl from '../controllers/auth';

//middlewares
import usernameValidator from '../middlewares/usernameValidate';
import passwordValidator from '../middlewares/passwordValidator';

router.post('/signup', usernameValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/access', userCtrl.auth);

//module.exports = router;

export default router;
