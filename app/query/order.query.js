module.exports = {
  insertOrder: (req) =>
    `INSERT INTO order_table
      (store_id, customer_id, ordered_products, total_price, discount, shipping_address, payment_method, order_status)
      VALUES(${req.storeId}, ${req.customerId},  '${req.orderedProducts}', ${req.totalPrice}, ${req.discount},' ${req.shippingAddress}', '${req.paymentMethod}', '${req.orderStatus}');
      `,
};
