"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//controller
//import userCtrl from '../controllers/auth';
const auth_1 = require("../controllers/auth");
//middlewares
const usernameValidate_1 = __importDefault(require("../middlewares/usernameValidate"));
const passwordValidator_1 = __importDefault(require("../middlewares/passwordValidator"));
router.post('/signup', usernameValidate_1.default, passwordValidator_1.default, auth_1.signup);
router.post('/login', auth_1.login);
router.post('/access', auth_1.auth);
exports.default = router;
