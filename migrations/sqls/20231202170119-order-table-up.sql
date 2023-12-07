CREATE TABLE order_table (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  customer_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ordered_products LONGTEXT,
  total_price DECIMAL(10, 2),
  discount DECIMAL(5, 2),
  shipping_address LONGTEXT,
  payment_method VARCHAR(50),
  order_status VARCHAR(50)
  );
