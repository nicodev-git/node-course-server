const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session");
///import after session
const MongoStore = require("connect-mongodb-session")(session);
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const authRoutes = require("./routes/auth");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const MONGODB_URI = `mongodb+srv://H12pb39M:H12pb39M@cluster0.f8fus.mongodb.net/shop`;

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("60c4b323da0f4c16784b765f");
//     req.user = user;
//     next();
//   } catch (e) {
//     console.log(e);
//   }
// });

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

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
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "vika@gmail.com",
    //     name: "Vika",
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Service is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
