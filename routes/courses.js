const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const Course = require("../models/course");
const { courseValidators } = require("../utils/validators");
const auth = require("../middleware/auth");
const router = Router();

function isOwner(course, req) {
  return course.userId.toString() == req.user._id.toString();
}
router.get("/", async (req, res) => {
  try {
    //   res.sendFile(path.join(__dirname, "views", "about.html"));
    const courses = await Course.find()
      .populate("userId", "email name")
      .select("price title img");

    res.render("courses", {
      title: "Courses",
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses: courses.map((elem) => ({ ...elem.toObject() })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", auth, async (req, res, next) => {
  try {
    if (!req.query.allow) {
      return res.redirect("/");
    }
    const course = await Course.findById(req.params.id);

    //якщо не співпадають id то переводимо на головну сторінку
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }

    res.render("course-edit", {
      title: `Edit ${course.title}`,
      course: course.toObject(),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/edit", auth, courseValidators, async (req, res, next) => {
  const errors = validationResult(req);
  const { id } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }
  try {
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }
    Object.assign(course, req.body);
    await course.save();
    // console.log(req.body);
    // await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
  } catch (error) {
    next(error);
  }
});

router.post("/remove", auth, async (req, res, next) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect("/courses");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("course", {
      layout: "empty",
      title: `Course ${course.title}`,
      course: course.toObject(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
