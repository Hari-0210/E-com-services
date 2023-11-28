const { query } = require("../../helper/executequery");
const { generateToken } = require("../../helper/jwtToken");
const { responseHandler } = require("../../utilities");
const { responseMessages } = require("../../utilities/messages");
const { createStoreSchema } = require("../../utilities/schema");
const {
  getTenantIdFromRequest,
  mysqlSingleResponseHandler,
} = require("../../utilities/utility");
const { storePresentQuery, store } = require("../query/store.query");
const { createStoreSP } = require("../services/store.services");

const createStoreHandler = async (req, res) => {
  try {
    await createStoreSchema.validateAsync(req.body);
    const tenantId = getTenantIdFromRequest(req);
    req.body.userId = tenantId;
    await createStoreSP(req.body);
    let resp;
    resp = await query(store(tenantId));
    responseHandler.successResponse(
      res,
      { resp },
      responseMessages.addedSuccessfully
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      responseHandler.errorResponse(
        res,
        responseMessages.duplicateEntry,
        responseMessages.storeAlreadyCreated
      );
    } else {
      responseHandler.errorResponse(res, err.message, err.message);
    }
  }
};

const storePresent = async (req, res) => {
  try {
    let resp;
    resp = await query(storePresentQuery(req.body.store));
    const rows = mysqlSingleResponseHandler(resp);
    const newToken = generateToken(rows);
    if (Object.keys(rows).length) {
      responseHandler.successResponse(
        res,
        {
          token: newToken,
          ...rows,
        },
        responseMessages.successBoolean
      );
    } else {
      responseHandler.successResponse(res, responseMessages.failureBoolean);
    }
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

const createStoreSettingsHandler = async (req, res) => {
  try {
    await createProductSchema.validateAsync(req.body);
    const { storeId, ...rest } = req.body;
    let productResp = await query(fetchProductAdmin(storeId));
    productResp = mysqlSingleResponseHandler(productResp);

    if (Object.keys(productResp).length === 0) {
      let productJson = [];
      productJson.push(rest);
      productJson = productJson.map((e, i) => {
        return {
          ...e,
          productId: i + 1,
        };
      });
      await query(
        insertProducts(JSON.stringify(productJson, null, 2), storeId)
      );
    } else {
      let productJson = JSON.parse(productResp.productJson);
      productJson.push(rest);
      productJson = productJson.map((e, i) => {
        return {
          ...e,
          productId: i + 1,
        };
      });
      await query(
        updateProducts(JSON.stringify(productJson, null, 2), storeId)
      );
    }
    responseHandler.successResponse(
      res,
      rest,
      responseMessages.addedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

module.exports = {
  createStore: createStoreHandler,
  storePresent: storePresent,
  createStoreSettings: createStoreSettingsHandler,
};
