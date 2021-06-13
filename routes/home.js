const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  try {
    //   res.sendFile(path.join(__dirname, "views", "index.html"));
    res.render("index", {
      title: "Main page",
      isHome: true,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
