import passwordValidator from 'password-validator';
import { Request, Response, NextFunction } from 'express';

const passwordSchema = new passwordValidator();

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

const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const password: string = req.body.password;
  if (passwordSchema.validate(password)) {
    next();
  } else {
    res.status(405).json({
      error:
        'The password is not strong enough, missing ' +
        passwordSchema.validate(password, { list: true }),
    });
  }
};

export default validatePassword;
