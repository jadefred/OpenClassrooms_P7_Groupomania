"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_config_js_1 = __importDefault(require("../middlewares/multer-config.js"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
//controller
const user_1 = __importDefault(require("../controllers/user"));
//routes
router.get('/:id', authentication_1.default, user_1.default.getUserInfo);
router.put('/:id', authentication_1.default, multer_config_js_1.default, user_1.default.modifyUserInfo);
router.delete('/:id', authentication_1.default, user_1.default.deleteUser);
module.exports = router;
