const { body, validationResult } = require("express-validator");
exports.registerValidators = [
  body("email").isEmail().withMessage("Type correct email"),
  body("password", "Password must be minimus 4 symbols")
    .isLength({ min: 4, max: 56 })
    .isAlphanumeric(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must be the same");
    }
    return true;
  }),
  body("name")
    .isLength({ min: 3 })
    .withMessage("the name must be bigger than 3 letters"),
];
