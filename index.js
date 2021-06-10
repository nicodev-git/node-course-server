const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

const PORT = process.env.PORT || 3000;
//server

app.listen(PORT, () => {
  console.log(`Service is running on port ${PORT}`);
});
