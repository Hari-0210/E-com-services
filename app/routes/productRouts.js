const express = require("express");
const { subRoutes } = require("../../utilities/constant");
const { fetchProducts } = require("../controller/product.controller");

const router = express.Router();

router.post(subRoutes.fetch, fetchProducts);

module.exports = router;
