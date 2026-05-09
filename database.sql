CREATE DATABASE IF NOT EXISTS grocery_inventory;
USE grocery_inventory;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  unit VARCHAR(30) NOT NULL DEFAULT 'pcs'
);

INSERT INTO products (name, price, unit) VALUES
('Rice (Basmati) 1kg', 120.00, 'bag'),
('Wheat Flour 1kg', 45.00, 'bag'),
('Sugar 1kg', 42.00, 'bag'),
('Toor Dal 1kg', 140.00, 'bag'),
('Sunflower Oil 1L', 165.00, 'bottle'),
('Salt 1kg', 18.00, 'pack'),
('Tea 250g', 95.00, 'pack'),
('Milk 1L', 56.00, 'carton'),
('Eggs (6 pcs)', 42.00, 'tray'),
('Onions 1kg', 35.00, 'kg'),
('Tomatoes 1kg', 40.00, 'kg'),
('Potatoes 1kg', 28.00, 'kg'),
('Bananas 1 dozen', 50.00, 'bunch'),
('Bread Loaf', 40.00, 'loaf'),
('Butter 100g', 55.00, 'pack'),
('Biscuits 200g', 35.00, 'pack'),
('Detergent 1kg', 110.00, 'box'),
('Soap (4 bars)', 72.00, 'pack')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  unit = VALUES(unit);
