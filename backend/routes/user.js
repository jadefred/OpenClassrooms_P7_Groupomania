const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.js');
const usernameValidator = require('../middlewares/usernameValidate');

router.post('/signup', usernameValidator, userCtrl.signup);
// router.post('/login', userCtrl.login);

module.exports = router;
