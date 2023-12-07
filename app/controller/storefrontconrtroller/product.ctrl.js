const { query } = require("../../../helper/executequery");
const { responseHandler } = require("../../../utilities");
const { responseMessages } = require("../../../utilities/messages");
const {
  getTenantIdFromRequest,
  mysqlResponseHandler,
  mysqlSingleResponseHandler,
} = require("../../../utilities/utility");
const {
  fetchProduct,
  fetchCategory,
  fetchCart,
  insertCart,
  updateCart,
  deleteCart,
} = require("../../query/product.query");

const fetchProducts = async (req, res) => {
  try {
    const tenantId = getTenantIdFromRequest(req);
    let resp = await query(fetchProduct(tenantId));
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

const fetchCategories = async (req, res) => {
  try {
    const tenantId = getTenantIdFromRequest(req);
    let resp = await query(fetchCategory(tenantId));
    resp = mysqlResponseHandler(resp);
    responseHandler.successResponse(
      res,
      resp,
      responseMessages.fetchedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

/**
 * addToCart - Add, update, or delete a product in the user's cart.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const addToCart = async (req, res) => {
  try {
    // Extract necessary information from the request
    const { productId, type, userId, storeId } = req.body;

    // Fetch the existing cart details for the user and store
    let resp = await query(fetchCart(storeId, userId));
    resp = mysqlSingleResponseHandler(resp);
    console.log("resp", resp);

    // Check if the user's cart is empty
    if (Object.keys(resp).length === 0) {
      // If empty, create a new cart with the first product
      const details = {
        details: [
          {
            productId: productId,
            quantity: 1,
          },
        ],
      };
      await query(
        insertCart(storeId, userId, JSON.stringify(details, null, 2))
      );
      // Set the response to the newly created cart details
      resp = { cartDetails: details };
    } else {
      // If the cart is not empty, parse the existing cart details
      const cartDetails = resp.cartDetails
        ? JSON.parse(resp.cartDetails).details
        : [];
      console.log("cartDetails", cartDetails);

      // Find the index of the product in the cart details array
      const productIndex = cartDetails.findIndex(
        (item) => item.productId === productId
      );

      // Handle different operations based on the type (add, sub, delete)
      if (type === "add" || type === "sub") {
        // If the product is already in the cart, update the quantity
        if (productIndex !== -1) {
          if (type === "add") {
            // Increment quantity if type is "add"
            cartDetails[productIndex].quantity += 1;
          } else if (type === "sub") {
            // Decrement quantity if type is "sub" and it's greater than 0
            if (cartDetails[productIndex].quantity > 0) {
              cartDetails[productIndex].quantity -= 1;
            }
            // If quantity becomes 0, remove the product from the cart
            if (cartDetails[productIndex].quantity === 0) {
              cartDetails.splice(productIndex, 1);
            }
          }
        } else {
          // If the product is not in the cart, add it with quantity 1
          cartDetails.push({ productId, quantity: 1 });
        }
      } else if (type === "delete" && productIndex !== -1) {
        // If type is "delete" and the product is in the cart, remove it
        cartDetails.splice(productIndex, 1);
      }

      console.log("cartDetails", cartDetails);

      // Check if the cartDetails array is not empty
      if (cartDetails.length > 0) {
        // If not empty, update the cart details in the database
        await query(
          updateCart(
            storeId,
            userId,
            JSON.stringify({ details: cartDetails }, null, 2)
          )
        );
        // Set the response to the updated cart details
        resp = { cartDetails };
        console.log("cartDetails", cartDetails);
      } else {
        // If empty, execute delete query to remove the cart entry
        await query(deleteCart(storeId, userId));
        // Set the response to an empty array for a deleted cart
        resp = { cartDetails: [] };
        console.log("Cart is empty. Deleted from the database.");
      }
    }

    // Send a success response with the updated or new cart details
    responseHandler.successResponse(
      res,
      resp,
      responseMessages.fetchedSuccessfully
    );
  } catch (err) {
    // Handle any errors and send an error response
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

const fetchCartHandler = async (req, res) => {
  try {
    const { userId, storeId } = req.body;
    let resp = await query(fetchCart(storeId, userId));
    resp = mysqlSingleResponseHandler(resp);
    const cartDetails = resp.cartDetails
      ? JSON.parse(resp.cartDetails).details
      : [];
    responseHandler.successResponse(
      res,
      cartDetails,
      responseMessages.fetchedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};

const deleteCartHandler = async (req, res) => {
  try {
    const { userId, storeId } = req.body;
    await query(deleteCart(storeId, userId));
    responseHandler.successResponse(
      res,
      responseMessages.deletedSuccessfully,
      responseMessages.deletedSuccessfully
    );
  } catch (err) {
    responseHandler.errorResponse(res, err.message, err.message);
  }
};
module.exports = {
  fetchProducts: fetchProducts,
  fetchCategories: fetchCategories,
  addToCart: addToCart,
  fetchCartHandler: fetchCartHandler,
  deleteCartHandler: deleteCartHandler,
};
