const { query } = require("../../../helper/executequery");
const { responseHandler } = require("../../../utilities");
const { responseMessages } = require("../../../utilities/messages");
const {
  getTenantIdFromRequest,
  mysqlResponseHandler,
  mysqlSingleResponseHandler,
} = require("../../../utilities/utility");
const { insertOrder } = require("../../query/order.query");

const createOrder = async (req, res) => {
  try {
    const {
      storeId,
      customerId,
      orderedProducts,
      totalPrice,
      discount,
      shippingAddress,
      paymentMethod,
      orderStatus,
    } = req.body;

    let payload = {
      storeId,
      customerId,
      orderedProducts: JSON.stringify(orderedProducts, null, 2),
      totalPrice,
      discount,
      shippingAddress: JSON.stringify(shippingAddress, null, 2),
      paymentMethod,
      orderStatus,
    };
    let resp = await query(insertOrder(payload));
    resp = mysqlSingleResponseHandler(resp);
    responseHandler.successResponse(
      res,
      resp,
      responseMessages.addedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

module.exports = {
  createOrder: createOrder,
};
