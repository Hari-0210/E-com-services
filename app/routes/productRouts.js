const express = require("express");
const { subRoutes } = require("../../utilities/constant");
const {
  fetchProducts,
  createProducts,
  uploadProductImages,
  updateProducts,
  fetchImage,
} = require("../controller/product.controller");
const uploadFile = require("../middlewares/upload");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post(subRoutes.fetch, fetchProducts);
router.post(subRoutes.add, createProducts);
router.post(subRoutes.update, updateProducts);
router.post(subRoutes.upload, upload.single("file"), uploadProductImages);
router.post(subRoutes.imgFetch, fetchImage);

module.exports = router;
