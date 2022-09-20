"use strict";
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');
const auth = require('../middlewares/authentication');
//controller
const userCtrl = require('../controllers/user.js');
//routes
router.get('/:id', auth, userCtrl.getUserInfo);
router.put('/:id', auth, multer, userCtrl.modifyUserInfo);
router.delete('/:id', auth, userCtrl.deleteUser);
module.exports = router;
