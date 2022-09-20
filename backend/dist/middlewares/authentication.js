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
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../database/database');
dotenv.config();
const accessTokenSecretKey = process.env.ACCESS_TOKEN;
module.exports = (req, res, next) => {
    var _a;
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decodedUserId = (_a = jwt.decode(token)) === null || _a === void 0 ? void 0 : _a.userId;
        if (!token || token === 'undefined') {
            return res
                .status(401)
                .json({ error: 'No authentication token is found' });
        }
        jwt.verify(token, accessTokenSecretKey, (err, user) => {
            if (err) {
                valdidateRefreshToken(decodedUserId);
            }
            else {
                next();
            }
        });
        //function to validate refresh token
        function valdidateRefreshToken(id) {
            return __awaiter(this, void 0, void 0, function* () {
                //search from databse
                const hasRefreshToken = yield pool.query('SELECT refresh_token FROM users WHERE user_id=$1', [id]);
                //if no refresh token in the database, send failed status
                if (hasRefreshToken.rows.length === 0)
                    return res.status(403).json({ error: 'Authentication failed' });
                const refreshToken = hasRefreshToken.rows[0].refresh_token;
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, token) => __awaiter(this, void 0, void 0, function* () {
                    //if error is detected, throw fail status code
                    if (err) {
                        return res.status(403).json({ error: 'Authentication failed' });
                    }
                    //if verification is good, send new access token to front end
                    const assessToken = jwt.sign({ userId: id }, process.env.ACCESS_TOKEN, {
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
