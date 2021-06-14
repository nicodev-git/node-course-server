const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator/check");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const keys = require("../keys");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const router = Router();

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY },
  })
);

router.get("/login", async (req, res) => {
  try {
    res.render("auth/login", {
      title: "Authorization",
      isLogin: true,
      loginError: req.flash("loginError"),
      registerError: req.flash("registerError"),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/auth/login#login");
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //шукаємо чи є такий по емейл
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        // const user = await User.findById("60c4b323da0f4c16784b765f");
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        //чекаємо коли все завершиться а потім перенапрявляємо
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Incorrect password");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "There is no such user");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    next(error);
  }
});
router.post("/register", body("email").isEmail(), async (req, res, next) => {
  try {
    const { name, email, password, confirm } = req.body;
    //there is the same email
    const candidate = await User.findOne({ email });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

    if (candidate) {
      req.flash("registerError", "Person with this email exists already");
      res.redirect("/auth/login#register");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      // const user = userLog.toObject();
      await user.save();

      await transporter.sendMail(regEmail(email));
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/reset", (req, res, next) => {
  res.render("auth/reset", {
    title: "Forget your password?",
    error: req.flash("error"),
  });
});
router.post("/reset", (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Something has gone wrong, try an attemp later");
        return res.redirect("/auth/reset");
      }
      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        const data = await transporter.sendMail(
          resetEmail(candidate.email, token)
        );

        res.redirect("/auth/login");
      } else {
        req.flash("error", "There is no such emal");
        res.redirect("/auth/reset");
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/password:token", async (req, res, next) => {
  if (!req.params.token) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res.redirect("/auth/login");
    } else {
      res.render("auth/password", {
        title: "restore access",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/password", async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      // console.log(user.resetToken);
      res.redirect("/auth/login");
    } else {
      req.flash("loginError", "The token life is ended already");
      res.redirect("/auth/login");
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
