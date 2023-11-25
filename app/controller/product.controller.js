const { query } = require("../../helper/executequery");
const { responseHandler } = require("../../utilities");
const { responseMessages } = require("../../utilities/messages");
const { createProductSchema } = require("../../utilities/schema");
const { mysqlSingleResponseHandler } = require("../../utilities/utility");
const {
  fetchProductAdmin,
  updateProducts,
  insertProducts,
} = require("../query/product.query");

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

const createProductHandler = async (req, res) => {
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

const uploadProductImagesHandler = async (req, res) => {
  let path = req.file.filename;

  try {
    responseHandler.successResponse(
      res,
      {
        fileName: req.file.originalname,
        path: path,
      },
      responseMessages.uploadSuccessfully
    );
  } catch (error) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

module.exports = {
  fetchProducts: fetchProducts,
  createProducts: createProductHandler,
  uploadProductImages: uploadProductImagesHandler,
};
