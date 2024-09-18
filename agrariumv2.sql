--
-- agrarium is a market place of agricultural products
--

DROP DATABASE IF EXISTS agrarium;
CREATE DATABASE agrarium;
USE agrarium;

-- user_role

DROP TABLE IF EXISTS user_role;

CREATE TABLE user_role (
   user_role_id CHAR(1) NOT NULL PRIMARY KEY,
   user_role_name VARCHAR(50)
);

INSERT INTO user_role VALUES 
  ('a', 'Administrator'),
  ('c', 'Customer'),
  ('s', 'Supplier');


-- product_type
  
DROP TABLE IF EXISTS product_type;
 
CREATE TABLE product_type (
   type_id CHAR(2) NOT NULL PRIMARY KEY,
   type_name VARCHAR(50)
);

INSERT INTO product_type VALUES 
  ('ca', 'Cacao Bean'),
  ('co', 'Coffee Bean'),
  ('ba', 'Bananas');
  
  
-- unit

DROP TABLE IF EXISTS unit;

CREATE TABLE unit (
   unit_id VARCHAR(2) PRIMARY KEY,
   unit_name VARCHAR(50)
);

INSERT INTO unit VALUES 
  ('kg', 'Kilogram'),
  ('q', 'Quintal'),
  ('t', 'Ton');
  
  
-- region
  
DROP TABLE IF EXISTS region;   

CREATE TABLE region (
   region_id CHAR(2) PRIMARY KEY,
   region_name VARCHAR(50)
);

INSERT INTO region VALUES 
  ('na', 'North America'),
  ('sa', 'South America'),
  ('ca', 'Central America');


-- country
  
DROP TABLE IF EXISTS country;     

CREATE TABLE country (
   country_id CHAR(3) PRIMARY KEY,
   region_id CHAR(2) NOT NULL,
   country_name VARCHAR(50),
   CONSTRAINT country_region_fk FOREIGN KEY (region_id) REFERENCES region (region_id)
);

INSERT INTO country VALUES 
  ('bol', 'sa', 'Bolivia'),
  ('bra', 'sa', 'Brazil'),
  ('col', 'sa', 'Colombia'),
  ('ecu', 'sa', 'Ecuador');


-- province

DROP TABLE IF EXISTS province;
  
CREATE TABLE province (
   province_id CHAR(3) NOT NULL,
   country_id CHAR(3) NOT NULL,
   province_name VARCHAR(50),
   PRIMARY KEY (province_id, country_id),
   CONSTRAINT province_country_fk FOREIGN KEY (country_id) REFERENCES country (country_id)
);

INSERT INTO province VALUES 
  ('esm', 'ecu', 'Esmeraldas'),
  ('gua', 'ecu', 'Guayas'),
  ('ele', 'ecu', 'Santa Elena'),  
  ('man', 'ecu', 'Manabi'),  
  ('gal', 'ecu', 'Galapagos'),
  ('pic', 'ecu', 'Pichincha'),
  ('amz', 'bra', 'Amazonas'),
  ('mat', 'bra', 'Mato Grosso'),
  ('par', 'bra', 'Parana'),
  ('cru', 'bol', 'Santa Cruz'),
  ('pot', 'bol', 'Potosi'),
  ('paz', 'bol', 'La Paz'),
  ('ant', 'col', 'Antioquia');
  

-- user_credentials: the password is saved as a cryptographic hash produced by the function SHA

DROP TABLE IF EXISTS user_credentials;

CREATE TABLE user_credentials (
   user_id VARCHAR(30) NOT NULL PRIMARY KEY,
   user_role_id CHAR(1),
   password CHAR(40) NOT NULL,
   CONSTRAINT user_credentials_role_id_fk FOREIGN KEY (user_role_id) REFERENCES user_role (user_role_id)  
);

INSERT INTO user_credentials VALUES
   ('ana@agrarium.com', 'a', SHA('ana')),
   ('ryan@agrarium.com', 'a', SHA('ryan')),
   ('grace@agrarium.com', 'a', SHA('grace')),
   ('m.alvarez@rdc.com', 'c', SHA('marcos')),
   ('s.vegas@jvc.com', 'c', SHA('samantha')),
   ('r.montoya@coacao.com', 's', SHA('ramiro')),
   ('a.vargas@pragmac.com', 's', SHA('alejandra'));


-- administrator: role_id = 'a'

DROP TABLE IF EXISTS administrator;

CREATE TABLE administrator (
   admin_id VARCHAR(30) NOT NULL PRIMARY KEY,
   first_name VARCHAR(10),
   last_name VARCHAR(20),
   CONSTRAINT admin_id_fk FOREIGN KEY (admin_id) REFERENCES user_credentials (user_id)
);

INSERT INTO administrator VALUES
   ('ana@agrarium.com', 'Ana', 'Ortiz'),
   ('ryan@agrarium.com', 'Ryan', 'Lamping'),
   ('grace@agrarium.com', 'Grace', 'Lin');
  
  
-- customer: role_id = 'c'

DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
   customer_id VARCHAR(30) PRIMARY KEY,
   first_name VARCHAR(10),
   last_name VARCHAR(20),
   business_name VARCHAR(50),
   business_url VARCHAR(50),
   business_address VARCHAR(50),
   phone_no VARCHAR(15),
   region_id CHAR(2),
   country_id CHAR(3),
   province_id CHAR(3),
   CONSTRAINT customer_id_fk FOREIGN KEY (customer_id) REFERENCES user_credentials (user_id),
   CONSTRAINT customer_region_fk FOREIGN KEY (region_id) REFERENCES region (region_id),
   CONSTRAINT customer_country_fk FOREIGN KEY (country_id) REFERENCES country (country_id),  
   CONSTRAINT customer_province_fk FOREIGN KEY (province_id) REFERENCES province (province_id) 
);

INSERT INTO customer VALUES
   ('m.alvarez@rdc.com', 'Marcos', 'Alvarez', 'Republica del Cacao', 'www.rdc.com', '555 street', '123098', 'sa', 'ecu', 'pic'),
   ('s.vegas@jvc.com', 'Samantha', 'Vegas', 'Juan Valdez Cafe', 'www.jvc.com', '553 Street', '19283', 'sa', 'ecu', 'gua');


-- supplier: role_id = 's'
   
DROP TABLE IF EXISTS supplier; 

CREATE TABLE supplier (
   supplier_id VARCHAR(30) NOT NULL PRIMARY KEY,
   first_name VARCHAR(10),
   last_name VARCHAR(20),
   business_name VARCHAR(50),
   business_url VARCHAR(50),
   business_address VARCHAR(50),
   phone_no VARCHAR(15),
   region_id CHAR(2),
   country_id CHAR(3),
   province_id CHAR(3),
   CONSTRAINT supplier_id_fk FOREIGN KEY (supplier_id) REFERENCES user_credentials (user_id),
   CONSTRAINT supplier_region_fk FOREIGN KEY (region_id) REFERENCES region (region_id),
   CONSTRAINT supplier_country_fk FOREIGN KEY (country_id) REFERENCES country (country_id),  
   CONSTRAINT supplier_province_fk FOREIGN KEY (province_id) REFERENCES province (province_id)  
);

INSERT INTO supplier VALUES
   ('r.montoya@coacao.com', 'Ramiro', 'Montoya', 'Coacao', 'www.coacao.com', '123 Street', '123456', 'sa', 'ecu', 'esm'),
   ('a.vargas@pragmac.com', 'Alejandra', 'Vargas', 'Pragma cafe', 'www.pragmac.com', '125 Street', '234567', 'sa', 'col', 'ant');


-- customer_billing

DROP TABLE IF EXISTS customer_billing;

CREATE TABLE customer_billing (
   customer_id VARCHAR(30),
   payment_method_no TINYINT UNSIGNED,
   name_on_account VARCHAR(50),
   account_number VARCHAR(20),
   PRIMARY KEY (customer_id, payment_method_no)
);

-- supplier billing

DROP TABLE IF EXISTS supplier_billing;

CREATE TABLE supplier_billing (
   supplier_id VARCHAR(30),
   payment_method_no TINYINT UNSIGNED,
   name_on_account VARCHAR(50),
   account_number VARCHAR(20),
   PRIMARY KEY (supplier_id, payment_method_no)
);


-- product

DROP TABLE IF EXISTS product; 

CREATE TABLE product (
   product_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   type_id CHAR(2),
   supplier_id VARCHAR(30),
   unit_id VARCHAR(2),
   price DECIMAL(8,2),
   available_stock SMALLINT UNSIGNED,
   harvest_date DATE DEFAULT NULL,
   harvest_cycle VARCHAR(30),
   CONSTRAINT product_type_fk FOREIGN KEY (type_id) REFERENCES product_type (type_id),
   CONSTRAINT product_supplier_id_fk FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id), 
   CONSTRAINT product_unit_fk FOREIGN KEY (unit_id) REFERENCES unit (unit_id)
);

INSERT INTO product (type_id, supplier_id, unit_id, price, available_stock, harvest_date, harvest_cycle) VALUES
   ('ca', 'r.montoya@coacao.com', 'q', 180.0, 15, '2024-03-30', '3 months'),
   ('co', 'a.vargas@pragmac.com', 'q', 150.0, 20, '2023-12-30', '2 months');


-- product rating

DROP TABLE IF EXISTS product_rating;

CREATE TABLE product_rating (
   product_id SMALLINT UNSIGNED,
   user_id VARCHAR(30),
   rating DECIMAL(2,1),
   rating_date DATE DEFAULT NULL,
   rating_details VARCHAR(50),
   PRIMARY KEY (product_id, user_id),
   CONSTRAINT product_rating_id_fk FOREIGN KEY (product_id) REFERENCES product (product_id),
   CONSTRAINT product_rating_user_id_fk FOREIGN KEY (user_id) REFERENCES user_credentials (user_id)
);

INSERT INTO product_rating VALUES
   (1, 'm.alvarez@rdc.com', 8.5, '2023-11-26', 'Good cacao'),
   (1, 's.vegas@jvc.com', 9.5, '2023-11-26', 'Premium cacao'),
   (2, 'm.alvarez@rdc.com', 9.5, '2023-11-26', 'Delicious coffe'),
   (2, 's.vegas@jvc.com', 7.0, '2023-11-26', 'Standard cofee');
   

-- product_type_attribute

DROP TABLE IF EXISTS product_type_attribute;

CREATE TABLE product_type_attribute (
   type_id CHAR(2) NOT NULL,
   attribute_id TINYINT UNSIGNED NOT NULL,
   attribute_name VARCHAR(20),
   PRIMARY KEY (type_id, attribute_id),
   CONSTRAINT product_type_attribute_type_id_fk FOREIGN KEY (type_id) REFERENCES product_type (type_id)
);

INSERT INTO product_type_attribute VALUES
   ('ca', 1, 'Aroma'),
   ('ca', 2, 'Sweetness'),
   ('ca', 3, 'Color'),
   ('co', 1, 'Aroma'),
   ('co', 2, 'Acidity'),
   ('co', 3, 'Bitterness');


-- product_attribute_value

DROP TABLE IF EXISTS product_attribute_value;

CREATE TABLE product_attribute_value (
   product_id SMALLINT UNSIGNED NOT NULL,
   attribute_id TINYINT UNSIGNED NOT NULL,
   attribute_value VARCHAR(10),
   value_description VARCHAR(100),
   PRIMARY KEY (product_id, attribute_id),
   CONSTRAINT product_attribute_value_product_id_fk FOREIGN KEY (product_id) REFERENCES product (product_id)
);

INSERT INTO product_attribute_value VALUES
   (1, 1, '10', 'Rich chocolate aroma: 5, Dried fruit (raisins, figs): 4'),
   (1, 2, '9', 'Moderate sweetness: 3'),
   (1, 3, '9', 'Dark brown (indicative of well-roasted cacao beans)'),
   (2, 1, '10', 'Chocolate richness: 4, floral hints: 2, earthy tones:1'),
   (2, 2, '9', 'Bright and tangy: 3, Crispness: 4'),
   (2, 3, '7', 'Moderate bitterness: 3, Dark roast intensity: 4');   
   

-- shipping_address

DROP TABLE IF EXISTS shipping_address;

CREATE TABLE shipping_address (
   shipping_address_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   customer_id VARCHAR(30),
   address_details VARCHAR(100),
   default_address TINYINT UNSIGNED,
   CONSTRAINT shipping_addresses_customer_id_fk FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
);

INSERT INTO shipping_address (customer_id, address_details, default_address) VALUES
   ('m.alvarez@rdc.com', '555 street main', 1),
   ('m.alvarez@rdc.com', '555 street', 0),
   ('s.vegas@jvc.com', '553 street', 1);

-- delivery status 

DROP TABLE IF EXISTS delivery_status;

CREATE TABLE delivery_status (
   delivery_status_id VARCHAR(3) PRIMARY KEY,
   delivery_status_name VARCHAR(20)
);

INSERT INTO delivery_status VALUES
   ('pen', 'pending'),
   ('pre', 'pre-transit'),
   ('tra', 'in transit'),
   ('out', 'out for delivery'),
   ('del', 'delivered');


-- payment status 

DROP TABLE IF EXISTS payment_status;

CREATE TABLE payment_status(
   payment_status_id VARCHAR(3) PRIMARY KEY,
   payment_status_name VARCHAR(20)
);

INSERT INTO payment_status VALUES
   ('onh', 'on hold'),
   ('com', 'completed');

-- shipping type

DROP TABLE IF EXISTS shipping_type;

CREATE TABLE shipping_type(
   shipping_type_id VARCHAR(3) PRIMARY KEY,
   shipping_type_name VARCHAR(20)
);

INSERT INTO shipping_type VALUES
   ('sta', 'standard'),
   ('pre', 'premium');

-- shipping copmany

DROP TABLE IF EXISTS shipping_company;

CREATE TABLE shipping_company(
   shipping_company_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   shipping_company_name VARCHAR(20),
   address_details VARCHAR (100),
   phone_no VARCHAR(15)
);

INSERT INTO shipping_company (shipping_company_name, address_details, phone_no) VALUES
   ('Dialnet','12345 Street', '098098098'),
   ('Swire Shipping', '67890 Street', '098765432'),
   ('Alpega Group', '81726 Street', '098321765');

-- order

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  order_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(30),
  payment_method_no TINYINT UNSIGNED,
  order_date DATE NOT NULL,
  shipping_address_id TINYINT UNSIGNED,
  shipping_type_id VARCHAR(30),
  shipping_company_id TINYINT UNSIGNED, 
  subtotal_price DECIMAL(8, 2),
  handling_and_fees DECIMAL(8, 2),
  total_price DECIMAL(8, 2),
  delivery_status_id VARCHAR(30),
  delivery_date DATE DEFAULT NULL,
  payment_status_id VARCHAR(30),
  CONSTRAINT order_customer_id_fk FOREIGN KEY (customer_id) REFERENCES customer (customer_id),
  CONSTRAINT order_shipping_address_id_fk FOREIGN KEY (shipping_address_id) REFERENCES shipping_address (shipping_address_id),
  CONSTRAINT order_payment_method_fk FOREIGN KEY (customer_id, payment_method_no) REFERENCES customer_billing (customer_id, payment_method_no),
  CONSTRAINT order_shipping_type_id_fk FOREIGN KEY (shipping_type_id) REFERENCES shipping_type(shipping_type_id),
  CONSTRAINT order_shipping_company_id_fk FOREIGN KEY (shipping_company_id) REFERENCES shipping_company (shipping_company_id),
  CONSTRAINT order_delivery_status_id_fk FOREIGN KEY (delivery_status_id) REFERENCES delivery_status(delivery_status_id),
  CONSTRAINT order_payment_status_id_fk FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);

-- order_payment

DROP TABLE IF EXISTS order_payment;

CREATE TABLE order_payment (
   order_id SMALLINT UNSIGNED,
   payment_no TINYINT UNSIGNED,
   amount DECIMAL(8, 2),
   date DATE NOT NULL,
   PRIMARY KEY (order_id, payment_no),
   CONSTRAINT order_payment_order_id_fk FOREIGN KEY (order_id) REFERENCES `order` (order_id)
);


-- order_detail

DROP TABLE IF EXISTS order_detail;

CREATE TABLE order_detail (
   order_id SMALLINT UNSIGNED,
   item_no TINYINT UNSIGNED,
   product_id SMALLINT UNSIGNED,
   quantity TINYINT UNSIGNED,
   price DECIMAL(8, 2),
   PRIMARY KEY (order_id, item_no),
   CONSTRAINT order_detail_order_id_fk FOREIGN KEY (order_id) REFERENCES `order` (order_id),   
   CONSTRAINT order_detail_product_id_fk FOREIGN KEY (product_id) REFERENCES product (product_id)
);
   
   
-- avg_product_rating: calculates the average of the ratings for each product

DROP VIEW IF EXISTS avg_product_rating;

CREATE VIEW avg_product_rating AS (
   SELECT product_id, AVG(rating) AS avg_rating FROM product_rating GROUP BY product_id
);


-- products: products and ratings

DROP VIEW IF EXISTS products;

CREATE VIEW products AS (
   SELECT product.product_id, supplier.business_name AS 'supplier_name', unit.unit_name, price, avg_rating, available_stock, harvest_date, harvest_cycle,
          region.region_name, country.country_name, province.province_name
   FROM product
   JOIN supplier ON (product.supplier_id = supplier.supplier_id)
   JOIN unit ON (product.unit_id = unit.unit_id)
   JOIN avg_product_rating ON (product.product_id = avg_product_rating.product_id)
   JOIN region ON (supplier.region_id = region.region_id)
   JOIN country ON (supplier.country_id = country.country_id)
   JOIN province ON (supplier.province_id = province.province_id)
);


-- product_attributes: products, attributes and values (without JOIN)

DROP VIEW IF EXISTS product_attributes;

CREATE VIEW product_attributes AS (
   SELECT product_id, product_type_attribute.attribute_name, attribute_value, value_description 
   FROM product_attribute_value, product_type_attribute
   WHERE product_attribute_value.attribute_id = product_type_attribute.attribute_id
   GROUP BY product_id, product_attribute_value.attribute_id
);


-- product_attributes: products, attributes and values (JOIN)

DROP VIEW IF EXISTS product_attributes;

CREATE VIEW product_attributes AS (
   SELECT product_id, product_type_attribute.attribute_name, attribute_value, value_description 
   FROM product_attribute_value
   JOIN product_type_attribute ON (product_attribute_value.attribute_id = product_type_attribute.attribute_id)
   GROUP BY product_id, product_attribute_value.attribute_id
);


SELECT 
    DISTINCT od.order_id,
    od.product_id,
    EXTRACT(MONTH FROM o.order_date) AS order_month,
    COUNT(o.order_id) AS order_count
FROM 
    order_detail od
JOIN 
    `order` o ON od.order_id = o.order_id
GROUP BY 
    od.product_id, od.order_id, EXTRACT(MONTH FROM o.order_date)
ORDER BY 
    od.product_id, EXTRACT(MONTH FROM o.order_date);