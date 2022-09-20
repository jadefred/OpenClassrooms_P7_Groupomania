"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split(' ').join('_'));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpg')) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// module.exports
const multerExport = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
}).single('image');
module.exports = multerExport;
