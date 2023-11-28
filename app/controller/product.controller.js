const { query } = require("../../helper/executequery");
const { responseHandler } = require("../../utilities");
const { responseMessages } = require("../../utilities/messages");
const {
  createProductSchema,
  updateProductSchema,
} = require("../../utilities/schema");
const { mysqlSingleResponseHandler } = require("../../utilities/utility");
const {
  fetchProductAdmin,
  updateProducts,
  insertProducts,
  insertProductImg,
  fetchProductImg,
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

const updateProductHandler = async (req, res) => {
  try {
    await updateProductSchema.validateAsync(req.body);
    const { storeId, productId, ...rest } = req.body;
    let productResp = await query(fetchProductAdmin(storeId));
    productResp = mysqlSingleResponseHandler(productResp);

    let productJson = JSON.parse(productResp.productJson);
    const indexToUpdate = productJson.findIndex(
      (product) => product.productId === productId
    );

    if (indexToUpdate !== -1) {
      productJson[indexToUpdate] = { ...productJson[indexToUpdate], ...rest };
    } else {
      console.log("Product not found");
    }
    await query(updateProducts(JSON.stringify(productJson, null, 2), storeId));
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
  try {
    const { originalname: fileName } = req.file;
    const { storeId } = req.body;
    const name = `${Date.now()}-bezkoder-${fileName}`;

    const values = [storeId, req.file.buffer, name, req.file.mimetype];
    await query(insertProductImg(), values);

    responseHandler.successResponse(
      res,
      {
        fileName: fileName,
        path: name,
      },
      responseMessages.uploadSuccessfully
    );
  } catch (error) {
    console.error(error);
    responseHandler.errorResponse(res, error.message, error.message);
  }
};

const fetchProductImagesHandler = async (req, res) => {
  try {
    const { fileName, storeId } = req.body;

    let resp = await query(fetchProductImg(storeId, fileName));
    resp = mysqlSingleResponseHandler(resp);

    responseHandler.successResponse(
      res,
      {
        ...resp,
      },
      responseMessages.uploadSuccessfully
    );
  } catch (error) {
    console.error(error);
    responseHandler.errorResponse(res, error.message, error.message);
  }
};

module.exports = {
  fetchProducts: fetchProducts,
  createProducts: createProductHandler,
  uploadProductImages: uploadProductImagesHandler,
  updateProducts: updateProductHandler,
  fetchImage: fetchProductImagesHandler,
};
