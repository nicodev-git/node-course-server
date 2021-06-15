const multer = require("multer");
const storage = multer.diskStorage({
  //куди складувати
  destination(req, file, cb) {
    cb(null, "images");
  },
  //як назвати
  filename(req, file, cb) {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});
const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
//validation
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
});
