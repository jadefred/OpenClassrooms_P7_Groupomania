"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_validator_1 = __importDefault(require("password-validator"));
const passwordSchema = new password_validator_1.default();
passwordSchema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 1 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(['Passw0rd', 'Password123']); // Blacklist these values
const validatePassword = (req, res, next) => {
    const password = req.body.password;
    if (passwordSchema.validate(password)) {
        next();
    }
    else {
        res.status(405).json({
            error: 'The password is not strong enough, missing ' +
                passwordSchema.validate(password, { list: true }),
        });
    }
};
exports.default = validatePassword;
