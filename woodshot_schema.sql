-- WoodShot Database Schema for Neon (PostgreSQL)
-- Generated from Flask SQLAlchemy models


-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_email VARCHAR(255) NOT NULL,
    customer_first_name VARCHAR(255) NOT NULL,
    customer_last_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(255),
    customer_street VARCHAR(255) NOT NULL,
    customer_city VARCHAR(255) NOT NULL,
    customer_postal_code VARCHAR(255) NOT NULL,
    customer_country VARCHAR(255) NOT NULL,
    customer_latitude REAL,
    customer_longitude REAL,
    status VARCHAR(255) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_date TIMESTAMP WITH TIME ZONE,
    payment_status VARCHAR(255) DEFAULT 'pending',
    tracking_number VARCHAR(255) UNIQUE
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    wood_type VARCHAR(255) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    specifications JSONB,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Create deliveries table
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    driver_id INTEGER,
    status VARCHAR(255) DEFAULT 'pending',
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    current_lat REAL,
    current_lng REAL,
    route_coordinates JSONB
);

-- Indexes
CREATE INDEX idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX idx_products_wood_type ON products(wood_type);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);

-- Sample data for testing

-- Insert sample products
INSERT INTO products (name, description, wood_type, price_per_unit, unit, stock_quantity, image_url, specifications, is_available) VALUES
('Chêne Premium', 'High-quality oak wood for heating', 'chêne', 150.00, 'stère', 100, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png', '{"humidity": "15%", "density": "0.7 g/cm³"}', TRUE),
('Hêtre Naturel', 'Natural beech wood', 'hêtre', 120.00, 'stère', 80, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png', '{"humidity": "12%", "density": "0.65 g/cm³"}', TRUE),
('Bouleau Blanc', 'White birch wood', 'bouleau', 110.00, 'stère', 60, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png', '{"humidity": "10%", "density": "0.6 g/cm³"}', TRUE),
('Érable Rouge', 'Premium red maple wood for furniture', 'érable', 180.00, 'stère', 75, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602425/woodshot/products/image%20copy%203.png', '{"humidity": "14%", "density": "0.65 g/cm³"}', TRUE),
('Pin Sylvestre', 'Scots pine wood for construction', 'pin', 90.00, 'stère', 120, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602434/woodshot/products/image%20copy%205.png', '{"humidity": "18%", "density": "0.5 g/cm³"}', TRUE),
('Frêne Blanc', 'White ash wood for flooring', 'frêne', 160.00, 'stère', 85, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602438/woodshot/products/image%20copy%202.png', '{"humidity": "13%", "density": "0.6 g/cm³"}', TRUE),
('Noyer Noir', 'Black walnut wood for cabinetry', 'noyer', 220.00, 'stère', 50, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602449/woodshot/products/imagefond.png', '{"humidity": "11%", "density": "0.65 g/cm³"}', TRUE),
('Sapin Blanc', 'White spruce wood for general use', 'sapin', 85.00, 'stère', 140, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602455/woodshot/products/image%20copy%207.png', '{"humidity": "16%", "density": "0.45 g/cm³"}', TRUE),
('Tilleul', 'Linden wood for carving', 'tilleul', 130.00, 'stère', 70, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602468/woodshot/products/image%20copy.png', '{"humidity": "12%", "density": "0.55 g/cm³"}', TRUE),
('Châtaignier', 'Chestnut wood for outdoor use', 'châtaignier', 140.00, 'stère', 90, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602473/woodshot/products/image%20copy%206.png', '{"humidity": "15%", "density": "0.6 g/cm³"}', TRUE),
('Merisier', 'Cherry wood for furniture', 'merisier', 190.00, 'stère', 65, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602477/woodshot/products/image.png', '{"humidity": "12%", "density": "0.6 g/cm³"}', TRUE),
('Épicéa Commun', 'Norway spruce wood', 'épicéa', 95.00, 'stère', 110, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602491/woodshot/products/photospersonnes/image%20copy%202.png', '{"humidity": "17%", "density": "0.45 g/cm³"}', TRUE),
('Aulne Glutineux', 'Alder wood for smoking', 'aulne', 125.00, 'stère', 80, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602496/woodshot/products/photospersonnes/image%20copy.png', '{"humidity": "14%", "density": "0.5 g/cm³"}', TRUE),
('Orme', 'Elm wood for boat building', 'orme', 170.00, 'stère', 55, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602504/woodshot/products/photospersonnes/image.png', '{"humidity": "13%", "density": "0.55 g/cm³"}', TRUE),
('Bois de Chauffage Mixte', 'Mixed hardwood for heating', 'mixte', 135.00, 'stère', 95, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png', '{"humidity": "14%", "density": "0.65 g/cm³"}', TRUE),
('Chêne Rouge', 'Red oak wood for barrels', 'chêne rouge', 175.00, 'stère', 70, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png', '{"humidity": "16%", "density": "0.7 g/cm³"}', TRUE),
('Hêtre Blanc', 'White beech wood', 'hêtre blanc', 115.00, 'stère', 85, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png', '{"humidity": "11%", "density": "0.65 g/cm³"}', TRUE),
('Bouleau Jaune', 'Yellow birch wood', 'bouleau jaune', 125.00, 'stère', 75, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602425/woodshot/products/image%20copy%203.png', '{"humidity": "10%", "density": "0.6 g/cm³"}', TRUE),
('Pin Maritime', 'Maritime pine wood', 'pin maritime', 100.00, 'stère', 100, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602434/woodshot/products/image%20copy%205.png', '{"humidity": "19%", "density": "0.5 g/cm³"}', TRUE);

-- Insert sample inventory
INSERT INTO inventory (product_id, quantity, reserved_quantity) VALUES
(1, 100, 0),
(2, 80, 0),
(3, 60, 0),
(4, 75, 0),
(5, 120, 0),
(6, 85, 0),
(7, 50, 0),
(8, 140, 0),
(9, 70, 0),
(10, 90, 0),
(11, 65, 0),
(12, 110, 0),
(13, 80, 0),
(14, 55, 0),
(15, 95, 0),
(16, 70, 0),
(17, 85, 0),
(18, 75, 0),
(19, 100, 0);

-- Insert sample orders
INSERT INTO orders (customer_email, customer_first_name, customer_last_name, customer_phone, customer_street, customer_city, customer_postal_code, customer_country, customer_latitude, customer_longitude, status, total_amount, payment_status, tracking_number) VALUES
('john.doe@example.com', 'John', 'Doe', '+1987654321', '123 Main St', 'Douala', '237', 'Cameroon', 4.0511, 9.7679, 'confirmed', 270.00, 'paid', 'WS001'),
('jane.smith@example.com', 'Jane', 'Smith', '+1123456789', '456 Oak Ave', 'Yaoundé', '237', 'Cameroon', 3.8480, 11.5021, 'pending', 110.00, 'pending', 'WS002');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 150.00, 150.00),
(1, 2, 1, 120.00, 120.00),
(2, 3, 1, 110.00, 110.00);

-- Insert sample deliveries
INSERT INTO deliveries (order_id, driver_id, status, estimated_delivery) VALUES
(1, 1, 'in_transit', NOW() + INTERVAL '2 days'),
(2, 1, 'pending', NOW() + INTERVAL '3 days');