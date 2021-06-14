const { body, validationResult } = require("express-validator");
const User = require("../models/user");
exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Type correct email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email exists already");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password must be minimus 4 symbols")
    .isLength({ min: 4, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must be the same");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("the name must be bigger than 3 letters")
    .trim(),
];
