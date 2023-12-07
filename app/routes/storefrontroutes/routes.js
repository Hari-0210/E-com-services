const express = require("express");
const { subRoutes } = require("../../../utilities/constant");
const {
  fetchProducts,
  fetchCategories,
  addToCart,
  fetchCartHandler,
  deleteCartHandler,
} = require("../../controller/storefrontconrtroller/product.ctrl");
const { fetchImage } = require("../../controller/product.controller");
const {
  createOrder,
} = require("../../controller/storefrontconrtroller/order.ctrl");
const {
  createCustomer,
  loginCustomer,
} = require("../../controller/storefrontconrtroller/customer.ctrl");

const router = express.Router();

// storefront ftech products
router.get("/product" + subRoutes.fetch, fetchProducts);
router.get("/categories" + subRoutes.fetch, fetchCategories);
router.post("/product" + subRoutes.imgFetch, fetchImage);
router.post("/order" + subRoutes.add, createOrder);
router.post("/customer" + subRoutes.add, createCustomer);
router.post("/customer" + subRoutes.login, loginCustomer);
router.post("/product" + subRoutes.cart, addToCart);
router.post("/product" + subRoutes.fetchCart, fetchCartHandler);
router.post("/product" + subRoutes.deleteCart, deleteCartHandler);

module.exports = router;
