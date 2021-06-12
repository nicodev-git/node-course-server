const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "about.html"));
  res.render("add", {
    title: "add course",
    isAdd: true,
  });
});
router.post("/", async (req, res) => {
  //   console.log(req.body);
  // const course = new Course(req.body.title, req.body.price, req.body.img);
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
