"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//middleware to check username, throw error when username is empty or violated the requirement
//username can containe only uppercase, lowercase letter, number and underscore, between 3 & 30 characters
const usernameValidator = (req, res, next) => {
    try {
        const { username } = req.body;
        const regexUsername = /[\w]{3,30}$/;
        if (!username || !regexUsername.test(username)) {
            throw 'Username is not valide';
        }
        next();
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        else
            message = String(error);
        res.status(401).json({ message });
    }
};
exports.default = usernameValidator;
