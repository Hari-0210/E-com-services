const { query } = require("../../../helper/executequery");
const { responseHandler } = require("../../../utilities");
const { responseMessages } = require("../../../utilities/messages");
const {
  getTenantIdFromRequest,
  mysqlResponseHandler,
  mysqlSingleResponseHandler,
} = require("../../../utilities/utility");
const {
  insertCustomer,
  getCustomerByEmail,
} = require("../../query/customer.query");

const createCustomer = async (req, res) => {
  try {
    const { storeId, name, email, password } = req.body;

    let payload = {
      storeId,
      name,
      email,
      password,
    };
    let resp = await query(insertCustomer(payload));
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

const loginCustomer = async (req, res) => {
  try {
    const { storeId, email, password } = req.body;
    let resp = await query(getCustomerByEmail(storeId, email));
    resp = mysqlSingleResponseHandler(resp);

    if (!resp) {
      responseHandler.errorResponse(
        res,
        "Invalid email or password",
        "Invalid email or password"
      );
      return;
    }

    if (password === resp.password) {
      responseHandler.successResponse(res, resp, "Login successful");
    } else {
      responseHandler.errorResponse(
        res,
        "Invalid email or password",
        "Invalid email or password"
      );
    }
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

module.exports = {
  createCustomer: createCustomer,
  loginCustomer: loginCustomer,
};
