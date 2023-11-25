module.exports = {
  fetchProduct: (tenantId) =>
    `SELECT * from products p 
    inner join store s 
    on s.storeid  = p.storeid 
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
};
