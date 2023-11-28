CREATE TABLE productImages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT,
  storeId INT,
  image LONGBLOB,
  fileName VARCHAR(255),
  mimeType VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
