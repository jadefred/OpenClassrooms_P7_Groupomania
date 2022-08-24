const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authentication');

//controller
const userCtrl = require('../controllers/auth.js');

//middlewares
const usernameValidator = require('../middlewares/usernameValidate');
const passwordValidator = require('../middlewares/passwordValidator');

router.post('/signup', usernameValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/access', userCtrl.auth);

module.exports = router;
