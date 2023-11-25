CREATE TABLE `categories` (
  `storeid` INT,
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(255) NOT NULL,,
  FOREIGN KEY (`storeid`) REFERENCES `store`(`storeid`)
);