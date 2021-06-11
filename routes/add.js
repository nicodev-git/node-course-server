const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "about.html"));
  res.render("add", {
    title: "add course",
    isAdd: true,
  });
});

module.exports = router;
