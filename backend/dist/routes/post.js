"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_config_1 = __importDefault(require("../middlewares/multer-config"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
//controller
const post_1 = __importDefault(require("../controllers/post"));
//routes
//CRUD posts
router.get('/', authentication_1.default, post_1.default.getAllPosts);
router.post('/', authentication_1.default, multer_config_1.default, post_1.default.createPost);
router.put('/', authentication_1.default, multer_config_1.default, post_1.default.modifyPost);
router.delete('/', authentication_1.default, post_1.default.deletePost);
//like
router.post('/like', post_1.default.likePost);
module.exports = router;
