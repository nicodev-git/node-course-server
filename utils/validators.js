const { body } = require("express-validator");
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
  body("password", "Password must be minimum 4 symbols")
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
exports.loginValidators = [
  body("email").isEmail().withMessage("Type correct email").normalizeEmail(),
  body("password", "Password must be minimum 4 symbols")
    .isLength({ min: 4, max: 56 })
    .isAlphanumeric()
    .trim(),
];

exports.courseValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("The title must be longer than 3 letters")
    .trim(),
  body("price").isNumeric().withMessage("Type correct price"),
  body("img", "type correct picture URL").isURL(),
];
