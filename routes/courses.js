const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "about.html"));
  res.render("courses", {
    title: "Courses",
    isCourses: true,
  });
});

module.exports = router;
