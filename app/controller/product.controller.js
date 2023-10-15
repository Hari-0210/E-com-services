const { query } = require("../../helper/executequery");
const { responseHandler } = require("../../utilities");
const { responseMessages } = require("../../utilities/messages");
const { mysqlSingleResponseHandler } = require("../../utilities/utility");
const { fetchProductAdmin } = require("../query/product.query");

const fetchProducts = async (req, res) => {
  try {
    const storeId = req.body.storeId;
    let resp = await query(fetchProductAdmin(storeId));
    resp = mysqlSingleResponseHandler(resp);
    const parsedProductJson = JSON.parse(resp.productJson);
    responseHandler.successResponse(
      res,
      parsedProductJson,
      responseMessages.fetchedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

module.exports = {
  fetchProducts: fetchProducts,
};
