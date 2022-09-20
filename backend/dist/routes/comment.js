"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_config_1 = __importDefault(require("../middlewares/multer-config"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
//controller
const comment_1 = __importDefault(require("../controllers/comment"));
//comment
router.post('/comments', authentication_1.default, multer_config_1.default, comment_1.default.createComment);
router.get('/comments/:id', authentication_1.default, comment_1.default.getAllComments);
router.delete('/comments', authentication_1.default, comment_1.default.deleteComment);
module.exports = router;
