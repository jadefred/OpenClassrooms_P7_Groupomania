"use strict";
//middleware to check username, throw error when username is empty or violated the requirement
//username can containe only uppercase, lowercase letter, number and underscore, between 3 & 30 characters
module.exports = (req, res, next) => {
    try {
        const { username } = req.body;
        const regexUsername = /[\w]{3,30}$/;
        if (!username || !regexUsername.test(username)) {
            throw 'Username is not valide';
        }
        next();
    }
    catch (error) {
        res.status(401).json({ error });
    }
};
