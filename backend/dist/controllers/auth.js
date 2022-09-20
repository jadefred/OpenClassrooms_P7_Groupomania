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
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../database/database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('try to signup');
        const { username, email, password } = req.body;
        //check username validity
        const userNameRegex = /[a-zA-Z0-9_éèçàÉÈÇÀîÎïÏùÙ]{3,30}$/;
        if (username.length < 3 ||
            username.length > 30 ||
            !userNameRegex.test(username)) {
            return res.status(401).json({ error: 'Username invalide' });
        }
        //check email validity
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            console.log('wrong email');
            return res.status(401).json({ error: 'Email is invalid' });
        }
        //hash password before save to DB
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        yield pool.query('INSERT INTO users (user_id, username, email, pw_hashed) VALUES(uuid_generate_v4(), $1, $2, $3)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'Signup success' });
    }
    catch (error) {
        //unique_violation error
        if (error.code === '23505') {
            res.status(409).json({ message: 'This email has already used' });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //search user by email, return email and hashed password, if no matching email is found, throw error
        const user = yield pool.query('SELECT user_id, username, admin, avatar_url, pw_hashed FROM users WHERE email=$1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'User not exist' });
        }
        //compare req body password and hashed password which saved in DB
        const match = yield bcrypt.compare(password, user.rows[0].pw_hashed);
        if (!match) {
            return res.status(401).json({ error: 'Password incorrect' });
        }
        const userId = user.rows[0].user_id;
        const { username, admin } = user.rows[0];
        const avatarUrl = user.rows[0].avatar_url;
        const assessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
            expiresIn: '30m',
        });
        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
            expiresIn: '365d',
        });
        yield pool.query('UPDATE users SET refresh_token=$1 WHERE email=$2', [
            refreshToken,
            email,
        ]);
        //send userId, username, accesstoken, admin and avatar_url to frontend
        res
            .status(200)
            .cookie('accessToken', assessToken, { maxAge: 2 * 60 * 60 * 1000 }) //cookie expire in 2 hours
            .json({ _id: userId, username, token: assessToken, admin, avatarUrl });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        //return when no access token is found
        if (!token) {
            res.status(401).json({ error: 'No authentication token is found' });
        }
        //get userId from jwt
        const decodedUserId = jwt.decode(token).userId;
        //verify access token
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            //when error is found, call function to validate refresh token which saved in database
            if (err) {
                valdidateRefreshToken(decodedUserId);
            }
            else {
                //return user data
                const userInfo = yield pool.query('SELECT user_id, username, admin, avatar_url FROM users WHERE user_id=$1', [decodedUserId]);
                res.status(200).json(Object.assign({ token: token }, userInfo.rows[0]));
            }
        }));
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
                    const userInfo = yield pool.query('SELECT user_id, username, admin, avatar_url FROM users WHERE user_id=$1', [id]);
                    res
                        .status(200)
                        .cookie('accessToken', assessToken, {
                        maxAge: 2 * 60 * 60 * 1000,
                    })
                        .json(Object.assign({ token: assessToken }, userInfo.rows[0]));
                }));
            });
        }
    }
    catch (error) {
        res.status(403).json({ error: 'Authentication failed' });
    }
});
