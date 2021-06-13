const { Router } = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth");
const router = Router();
//получення списка заказів
router.get("/", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    }).populate("user.userId");
    res.render("orders", {
      isOrder: true,
      title: "Orders",
      orders: orders.map((o) => {
        const order = o.toObject();
        return {
          ...order,
          price: order.courses.reduce((total, c) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    next(e);
  }
});
//створення заказа
router.post("/", auth, async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        email: req.user.email,
        userId: req.user,
      },
      courses: courses.toObject(),
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    next(e);
  }
});
module.exports = router;
