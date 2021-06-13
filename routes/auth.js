const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = Router();

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
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, repeat } = req.body;
    //there is the same email
    const candidate = await User.findOne({ email });
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
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
