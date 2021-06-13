const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
  try {
    res.render("auth/login", {
      title: "Authorization",
      isLogin: true,
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
    const user = await User.findById("60c4b323da0f4c16784b765f");
    req.session.user = user;
    req.session.isAuthenticated = true;
    //чекаємо коли все завершиться а потім перенапрявляємо
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
