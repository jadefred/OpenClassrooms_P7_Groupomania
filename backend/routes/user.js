const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config.js');

//controller
const userCtrl = require('../controllers/user.js');

//routes
router.get('/:id', userCtrl.getUserInfo);
router.put('/:id', multer, userCtrl.modifyUserInfo);

module.exports = router;
