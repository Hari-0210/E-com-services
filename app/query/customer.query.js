module.exports = {
  insertCustomer: (req) =>
    `INSERT INTO customer
        (store_id, name, email, password)
        VALUES(${req.storeId}, '${req.name}',  '${req.email}', '${req.password}');
        `,
  getCustomerByEmail: (storeId, email) =>
    `SELECT * from customer where store_id = ${storeId} and email = '${email}'`,
};
