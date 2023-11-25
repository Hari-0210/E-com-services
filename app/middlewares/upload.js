const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req", file);
    console.log("__basedir", __basedir);
    cb(null, __basedir + "/resources/assets/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage });
module.exports = uploadFile;
