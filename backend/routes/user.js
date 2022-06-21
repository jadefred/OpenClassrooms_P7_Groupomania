const express = require('express');
const router = express.Router();

//controllers
const userCtrl = require('../controllers/user.js');

//middlewares
const usernameValidator = require('../middlewares/usernameValidate');
const passwordValidator = require('../middlewares/passwordValidator');

router.post('/signup', usernameValidator, passwordValidator, userCtrl.signup);
// router.post('/login', userCtrl.login);

module.exports = router;
