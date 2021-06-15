const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
router.get("/", async (req, res, next) => {
  try {
    res.render("profile", {
      title: "Profile",
      isProfile: true,
      user: req.user.toObject(),
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = router;
