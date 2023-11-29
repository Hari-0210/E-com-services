const express = require("express");
const {
  createStore,
  storePresent,
  fetchSiteSettings,
  createStoreSettings,
} = require("../controller/store.controller");
const { subRoutes } = require("../../utilities/constant");

const router = express.Router();

router.post(subRoutes.add, createStore);
router.post(subRoutes.isStore, storePresent);
router.post(subRoutes.fetchSettings, fetchSiteSettings);
router.post(subRoutes.addSettings, createStoreSettings);

module.exports = router;
