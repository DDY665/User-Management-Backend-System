const { body, validationResult } = require("express-validator");

// SIGNUP VALIDATION
const validateSignup = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(
        errors.array().map(err => err.msg).join(", ")
      );
      error.status = 400;
      return next(error);
    }

    next();
  }
];

// LOGIN VALIDATION (FIXED)
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        errors.array().map(err => err.msg).join(", ")
      );
      error.status = 400;
      return next(error);
    }
    next();
  }
];


module.exports = {
  validateSignup,
  validateLogin
};
