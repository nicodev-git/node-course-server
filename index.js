const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("60c4b323da0f4c16784b765f");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use((error, req, res, next) => {
  console.error(error);
  return res.render("error");
});

const PORT = process.env.PORT || 3000;
//server

async function start() {
  try {
    const url = `mongodb+srv://H12pb39M:H12pb39M@cluster0.f8fus.mongodb.net/shop`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "vika@gmail.com",
        name: "Vika",
        cart: { items: [] },
      });
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Service is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
