const { Router } = require("express");
const mongoose = require("mongoose");
const Course = require("../models/course");
const { route } = require("./home");
const router = Router();

router.get("/", async (req, res) => {
  try {
    //   res.sendFile(path.join(__dirname, "views", "about.html"));
    const courses = await Course.find()
      .populate("userId", "email name")
      .select("price title img");

    console.log(courses);
    res.render("courses", {
      title: "Courses",
      isCourses: true,
      courses: courses.map((elem) => ({ ...elem.toObject() })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    if (!req.query.allow) {
      return res.redirect("/");
    }
    const course = await Course.findById(req.params.id);
    res.render("course-edit", {
      title: `Edit ${course.title}`,
      course: course.toObject(),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/edit", async (req, res, next) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    // console.log(req.body);
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
  } catch (error) {
    next(error);
  }
});

router.post("/remove", async (req, res, next) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
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
