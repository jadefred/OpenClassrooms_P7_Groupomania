"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//const auth = require('../middlewares/authentication');
//controller
const auth_1 = __importDefault(require("../controllers/auth"));
//middlewares
const usernameValidate_1 = __importDefault(require("../middlewares/usernameValidate"));
const passwordValidator_1 = __importDefault(require("../middlewares/passwordValidator"));
router.post('/signup', usernameValidate_1.default, passwordValidator_1.default, auth_1.default.signup);
router.post('/login', auth_1.default.login);
router.post('/access', auth_1.default.auth);
module.exports = router;
