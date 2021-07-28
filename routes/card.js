const { Router } = require("express");
// const Card = require("../models/card");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = Router();

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
}
// рахуємо ціну загальну
function computePrice(courses) {
  return courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
}
router.post("/add", auth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.id);
    // await Card.add(course);
    await req.user.addToCart(course);
    res.redirect("/card");
  } catch (error) {
    next(error);
  }
});

router.delete("/remove/:id", auth, async (req, res, next) => {
  // const card = await Card.remove(req.params.id);
  try {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = mapCartItems(user.cart);
    const cart = {
      courses,
      price: computePrice(courses),
    };
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    // const card = await Card.fetch();
    const user = await req.user.populate("cart.items.courseId").execPopulate();
    const courses = mapCartItems(user.cart);
    // console.log(user.cart.items);
    res.render("card", {
      title: "Card",
      isCard: true,
      courses: courses,
      price: computePrice(courses),
    });
    // res.json({ test: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
