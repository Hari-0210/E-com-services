CREATE TABLE coupon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed_amount') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    minimum_purchase DECIMAL(10, 2),
    maximum_discount DECIMAL(10, 2),
    start_date VARCHAR(100),
    end_date VARCHAR(100),
    usage_limit INT,
    used_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    storeid INT
);
