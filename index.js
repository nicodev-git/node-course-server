const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  //   res.sendFile(path.join(__dirname, "views", "index.html"));
  res.render("index", {
    title: "Main page",
    isHome: true,
  });
});

app.get("/add", (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "about.html"));
  res.render("add", {
    title: "add course",
    isAdd: true,
  });
});
app.get("/courses", (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "about.html"));
  res.render("courses", {
    title: "Courses",
    isCourses: true,
  });
});

const PORT = process.env.PORT || 3000;
//server

app.listen(PORT, () => {
  console.log(`Service is running on port ${PORT}`);
});
