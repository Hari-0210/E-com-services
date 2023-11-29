const { query } = require("../../helper/executequery");
const { generateToken } = require("../../helper/jwtToken");
const { responseHandler } = require("../../utilities");
const { responseMessages } = require("../../utilities/messages");
const {
  createStoreSchema,
  siteSettingsSchema,
} = require("../../utilities/schema");
const {
  getTenantIdFromRequest,
  mysqlSingleResponseHandler,
} = require("../../utilities/utility");
const {
  storePresentQuery,
  store,
  siteSettingsQuery,
  insertSiteSettingsQuery,
  updateSiteSettingsQuery,
} = require("../query/store.query");
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
    await siteSettingsSchema.validateAsync(req.body);
    const { storeId, ...rest } = req.body;
    let resp = await query(siteSettingsQuery(storeId));
    resp = mysqlSingleResponseHandler(resp);

    if (Object.keys(resp).length === 0) {
      let json = rest;
      await query(
        insertSiteSettingsQuery(storeId, JSON.stringify(json, null, 2))
      );
    } else {
      let json = rest;
      await query(
        updateSiteSettingsQuery(storeId, JSON.stringify(json, null, 2))
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

const fetchSiteSettingsHandler = async (req, res) => {
  try {
    const { storeId } = req.body;
    let resp = await query(siteSettingsQuery(storeId));
    resp = mysqlSingleResponseHandler(resp);

    responseHandler.successResponse(
      res,
      resp,
      responseMessages.fetchedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

module.exports = {
  createStore: createStoreHandler,
  storePresent: storePresent,
  createStoreSettings: createStoreSettingsHandler,
  fetchSiteSettings: fetchSiteSettingsHandler,
};
