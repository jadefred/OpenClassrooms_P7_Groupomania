import express from 'express';
const router = express.Router();

//controller
import { signup, login, auth } from '../controllers/auth';

//middlewares
import usernameValidator from '../middlewares/usernameValidate';
import passwordValidator from '../middlewares/passwordValidator';

router.post('/signup', usernameValidator, passwordValidator, signup);
router.post('/login', login);
router.post('/access', auth);

export default router;
