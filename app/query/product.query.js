module.exports = {
  fetchProduct: (tenantId) =>
    `SELECT * from products p 
    inner join store s 
    on s.storeid  = p.storeid 
    where s.storename  = '${tenantId}'`,
  fetchCategory: (tenantId) =>
    `SELECT * from categories c  inner join store s 
    on s.storeid  = c.storeid 
    where s.storename  = '${tenantId}'`,
  fetchProductAdmin: (storeId) =>
    `SELECT * from products p 
    inner join store s 
    on s.storeid  = p.storeid 
    where p.storeid  = '${storeId}'`,
  updateProducts: (productJson, storeId) =>
    `update products p set productJson= '${productJson}'
    where p.storeid  = '${storeId}'`,
  insertProducts: (productJson, storeId) =>
    `INSERT INTO products
    (storeid, productJson)
    VALUES('${storeId}', '${productJson}');
    `,
  insertProductImg: () =>
    `INSERT INTO productImages ( storeId, image, fileName, mimeType) VALUES (?, ?, ?, ?);
    `,
  fetchProductImg: (storeId, fileName) =>
    `select * from productImages where storeId = '${storeId}' and fileName =  '${fileName}';
    `,
  fetchCart: (storeId, userId) =>
    `SELECT c.cart_details as cartDetails from cart c  
    where c.store_id  = ${storeId} and c.user_id = ${userId}`,
  insertCart: (storeId, userId, details) =>
    `INSERT INTO cart
    ( store_id, user_id, cart_details)
    VALUES( ${storeId}, ${userId}, '${details}');
    `,
  updateCart: (storeId, userId, details) =>
    `UPDATE cart
    SET cart_details='${details}', created_at='2023-12-03 07:55:56', updated_at='2023-12-03 07:55:56'
    WHERE store_id=${storeId} and user_id=${userId};`,
  deleteCart: (storeId, userId) =>
    `DELETE FROM cart
    WHERE store_id=${storeId} and user_id=${userId};`,
};
