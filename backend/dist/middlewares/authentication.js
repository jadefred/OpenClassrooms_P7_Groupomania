"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../database/database"));
dotenv_1.default.config();
const accessTokenSecretKey = process.env.ACCESS_TOKEN;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN;
const authFunction = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (token) {
            const decodedJWT = jsonwebtoken_1.default.decode(token);
            const decodedUserId = decodedJWT.userId;
            if (!token || token === 'undefined') {
                return res
                    .status(401)
                    .json({ error: 'No authentication token is found' });
            }
            jsonwebtoken_1.default.verify(token, accessTokenSecretKey, (err) => {
                if (err) {
                    valdidateRefreshToken(decodedUserId);
                }
                else {
                    next();
                }
            });
        }
        //function to validate refresh token
        function valdidateRefreshToken(id) {
            return __awaiter(this, void 0, void 0, function* () {
                //search from databse
                const hasRefreshToken = yield database_1.default.query('SELECT refresh_token FROM users WHERE user_id=$1', [id]);
                //if no refresh token in the database, send failed status
                if (hasRefreshToken.rows.length === 0)
                    return res.status(403).json({ error: 'Authentication failed' });
                const refreshToken = hasRefreshToken.rows[0].refresh_token;
                jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecretKey, (err) => __awaiter(this, void 0, void 0, function* () {
                    //if error is detected, throw fail status code
                    if (err) {
                        return res.status(403).json({ error: 'Authentication failed' });
                    }
                    //if verification is good, send new access token to front end
                    const assessToken = jsonwebtoken_1.default.sign({ userId: id }, process.env.ACCESS_TOKEN, {
                        expiresIn: '30m',
                    });
                    console.log('set refresh token - middleware');
                    res.cookie('accessToken', assessToken);
                    next();
                }));
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: 'Authentication failed' });
    }
};
module.exports = authFunction;
