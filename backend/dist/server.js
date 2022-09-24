"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_js_1 = __importDefault(require("./routes/post.js"));
const comment_js_1 = __importDefault(require("./routes/comment.js"));
const user_1 = __importDefault(require("./routes/user"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//CORS setting
const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:5432'],
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//routes
app.use('/api/auth', auth_1.default);
app.use('/api/posts', post_js_1.default);
app.use('/api/posts', comment_js_1.default);
app.use('/api/user', user_1.default);
//images handling
app.use('/image', express_1.default.static(path_1.default.join(__dirname, 'image')));
app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});
