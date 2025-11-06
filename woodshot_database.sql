-- WoodShot Database Schema - Complete SQL Script for Adminer
-- This script creates the complete database structure for the WoodShot e-commerce platform
-- Copy and paste this entire script into Adminer to set up the database

-- ===========================================
-- WOODSHOT DATABASE CREATION SCRIPT
-- ===========================================

-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE woodshot_db;
-- \c woodshot_db;

-- ===========================================
-- TABLE CREATION
-- ===========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    is_default BOOLEAN DEFAULT FALSE
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    wood_type VARCHAR(100) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    specifications JSONB,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    address_id INTEGER REFERENCES addresses(id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP WITH TIME ZONE,
    payment_status VARCHAR(50) DEFAULT 'pending',
    tracking_number VARCHAR(100) UNIQUE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    driver_id INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    current_lat FLOAT,
    current_lng FLOAT,
    route_coordinates JSONB
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- Addresses indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_wood_type ON products(wood_type);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Deliveries indexes
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for inventory table
CREATE TRIGGER update_inventory_last_updated
    BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- SAMPLE DATA INSERTION
-- ===========================================

-- Insert admin user
INSERT INTO users (email, password_hash, first_name, last_name, phone, is_admin) VALUES
('admin@woodshot.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uLjRp8rjTzO', 'Admin', 'WoodShot', '+33123456789', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert regular users
INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES
('jean.dupont@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uLjRp8rjTzO', 'Jean', 'Dupont', '+33123456790'),
('marie.martin@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uLjRp8rjTzO', 'Marie', 'Martin', '+33123456791'),
('pierre.durand@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uLjRp8rjTzO', 'Pierre', 'Durand', '+33123456792')
ON CONFLICT (email) DO NOTHING;

-- Insert addresses
INSERT INTO addresses (user_id, street, city, postal_code, country, latitude, longitude, is_default) VALUES
(2, '15 Rue de la Paix', 'Paris', '75001', 'France', 48.8566, 2.3522, TRUE),
(3, '25 Avenue des Champs', 'Lyon', '69002', 'France', 45.7640, 4.8357, TRUE),
(4, '8 Boulevard Saint-Michel', 'Marseille', '13001', 'France', 43.2965, 5.3698, TRUE)
ON CONFLICT DO NOTHING;

-- Insert products
INSERT INTO products (name, description, wood_type, price_per_unit, unit, stock_quantity, specifications, is_available) VALUES
('Bûches de Chêne Premium', 'Bûches de chêne séchées naturellement pendant 2 ans. Idéales pour une combustion lente et durable.', 'oak', 8.50, 'stère', 45,
 '{"humidity": 18, "density": 720, "calorific_value": 4.2, "cutting_type": "logs", "storage_advice": "Stockez les bûches à l''abri de l''humidité, surélevées du sol. Idéal pour un stockage extérieur couvert.", "burning_tips": ["Allumez avec du petit bois sec", "Ne surchargez pas le foyer", "Laissez un espace d''air entre les bûches", "Surveillez la combustion"]}', TRUE),

('Granulés de Hêtre', 'Granulés de hêtre de haute qualité, certifiés DIN+. Parfaits pour les poêles à granulés.', 'beech', 5.20, 'kg', 120,
 '{"humidity": 8, "density": 650, "calorific_value": 4.8, "cutting_type": "pellets", "storage_advice": "Conservez les granulés dans un endroit sec et frais. Utilisez des sacs hermétiques pour éviter l''humidité.", "burning_tips": ["Utilisez un poêle à granulés adapté", "Remplissez la trémie régulièrement", "Nettoyez le conduit de fumée annuellement", "Programmez la température idéale"]}', TRUE),

('Bois de Bouleau Fendu', 'Bois de bouleau fendu prêt à brûler. Excellente valeur calorifique et faible taux de résine.', 'birch', 6.80, 'stère', 23,
 '{"humidity": 15, "density": 650, "calorific_value": 4.1, "cutting_type": "split", "storage_advice": "Rangez les bûches fendues en tas ventilés. Protégez-les de la pluie avec une bâche.", "burning_tips": ["Placez les bûches verticalement pour une meilleure circulation d''air", "Commencez par les plus fines", "Évitez de mélanger avec d''autres essences", "Contrôlez la vitesse de combustion"]}', TRUE),

('Bois de Pin Sylvestre', 'Bois de pin parfumé et économique. Idéal pour les feux d''ambiance.', 'pine', 4.90, 'stère', 67,
 '{"humidity": 22, "density": 520, "calorific_value": 3.8, "cutting_type": "logs", "storage_advice": "Stockez à l''abri de l''humidité. Le pin dégage beaucoup de résine.", "burning_tips": ["Utilisez dans un foyer bien ventilé", "Évitez de brûler trop de pin d''affilée", "Parfait pour les soirées d''hiver", "Surveillez la formation de créosote"]}', TRUE),

('Palette Économique Mixte', 'Palette variée de bois de différentes essences. Solution économique pour tous vos besoins.', 'mixed', 250.00, 'palette', 12,
 '{"humidity": 25, "density": 680, "calorific_value": 3.9, "cutting_type": "mixed", "storage_advice": "Stockez sur palette couverte. Idéal pour les grands volumes.", "burning_tips": ["Mélangez les essences pour une combustion équilibrée", "Adaptez selon vos besoins énergétiques", "Économique pour les gros consommateurs", "Vérifiez la qualité avant utilisation"]}', TRUE),

('Bois de Chauffage Premium', 'Sélection premium de bois dur certifié. Qualité supérieure garantie.', 'oak', 9.80, 'stère', 34,
 '{"humidity": 16, "density": 750, "calorific_value": 4.4, "cutting_type": "split", "storage_advice": "Stockage optimal dans un abri sec et ventilé.", "burning_tips": ["Combustion lente et régulière", "Idéal pour les cheminées traditionnelles", "Puissance calorifique exceptionnelle", "Durée de combustion prolongée"]}', TRUE),

('Granulés Écologiques', 'Granulés issus de forêts gérées durablement. Respectueux de l''environnement.', 'beech', 6.50, 'kg', 89,
 '{"humidity": 7, "density": 680, "calorific_value": 5.0, "cutting_type": "pellets", "storage_advice": "Conservation en sacs étanches dans un endroit frais.", "burning_tips": ["Compatible avec tous les poêles à granulés", "Rendement énergétique optimal", "Faibles émissions de CO2", "Certifié écologique"]}', TRUE),

('Bois d''Érable Rouge', 'Bois d''érable rouge canadien. Combustion propre et puissante.', 'maple', 7.90, 'stère', 28,
 '{"humidity": 19, "density": 690, "calorific_value": 4.1, "cutting_type": "logs", "storage_advice": "Stockage à l''abri pendant au moins 1 an.", "burning_tips": ["Combustion très chaude", "Faible production de cendres", "Parfum agréable et discret", "Idéal pour les soirées froides"]}', TRUE),

('Bois de Frêne Blanc', 'Bois de frêne blanc de qualité supérieure. Combustion lente et calorifique.', 'ash', 8.20, 'stère', 41,
 '{"humidity": 17, "density": 710, "calorific_value": 4.3, "cutting_type": "split", "storage_advice": "Stockez dans un endroit sec et aéré.", "burning_tips": ["Excellente combustion prolongée", "Faible production de fumée", "Idéal pour les longues soirées", "Parfum subtil et agréable"]}', TRUE)
ON CONFLICT DO NOTHING;

-- Insert inventory records for all products
INSERT INTO inventory (product_id, quantity)
SELECT id, stock_quantity FROM products
ON CONFLICT (product_id) DO UPDATE SET
    quantity = EXCLUDED.quantity,
    last_updated = CURRENT_TIMESTAMP;

-- Insert sample orders
INSERT INTO orders (user_id, address_id, status, total_amount, delivery_date, payment_status, tracking_number) VALUES
(2, 1, 'delivered', 136.00, '2024-12-15 14:30:00+00', 'paid', 'WS2024001'),
(3, 2, 'shipped', 78.00, '2024-12-18 10:00:00+00', 'paid', 'WS2024002'),
(4, 3, 'preparing', 312.00, '2024-12-20 16:00:00+00', 'pending', 'WS2024003')
ON CONFLICT (tracking_number) DO NOTHING;

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 2, 8.50, 17.00),
(1, 3, 1, 6.80, 6.80),
(1, 4, 3, 4.90, 14.70),
(1, 8, 1, 7.90, 7.90),
(1, 9, 2, 8.20, 16.40),
(1, 2, 5, 5.20, 26.00),
(1, 7, 3, 6.50, 19.50),
(1, 6, 1, 9.80, 9.80),
(1, 5, 1, 250.00, 17.30),

(2, 2, 15, 5.20, 78.00),

(3, 5, 1, 250.00, 250.00),
(3, 1, 3, 8.50, 25.50),
(3, 6, 2, 9.80, 19.60),
(3, 9, 1, 8.20, 8.20),
(3, 3, 1, 6.80, 6.80)
ON CONFLICT DO NOTHING;

-- Insert delivery records
INSERT INTO deliveries (order_id, status, estimated_delivery, current_lat, current_lng, route_coordinates) VALUES
(1, 'delivered', '2024-12-15 14:30:00+00', 48.8566, 2.3522,
 '[{"lat": 48.8566, "lng": 2.3522}, {"lat": 48.8606, "lng": 2.3376}, {"lat": 48.8534, "lng": 2.3488}]'),

(2, 'in_transit', '2024-12-18 10:00:00+00', 45.7640, 4.8357,
 '[{"lat": 45.7640, "lng": 4.8357}, {"lat": 45.7673, "lng": 4.8343}, {"lat": 45.7578, "lng": 4.8320}]'),

(3, 'pending', '2024-12-20 16:00:00+00', 43.2965, 5.3698,
 '[{"lat": 43.2965, "lng": 5.3698}, {"lat": 43.2992, "lng": 5.3802}, {"lat": 43.2955, "lng": 5.3741}]')
ON CONFLICT (order_id) DO NOTHING;

-- ===========================================
-- USEFUL QUERIES FOR TESTING
-- ===========================================

-- Check all tables and their row counts
SELECT
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT
    'addresses' as table_name, COUNT(*) as row_count FROM addresses
UNION ALL
SELECT
    'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL
SELECT
    'inventory' as table_name, COUNT(*) as row_count FROM inventory
UNION ALL
SELECT
    'orders' as table_name, COUNT(*) as row_count FROM orders
UNION ALL
SELECT
    'order_items' as table_name, COUNT(*) as row_count FROM order_items
UNION ALL
SELECT
    'deliveries' as table_name, COUNT(*) as row_count FROM deliveries;

-- Get admin user for login testing
SELECT id, email, first_name, last_name, is_admin FROM users WHERE is_admin = TRUE;

-- Get products with low stock (less than 30 units)
SELECT id, name, wood_type, stock_quantity, unit
FROM products
WHERE stock_quantity < 30 AND is_available = TRUE
ORDER BY stock_quantity ASC;

-- Get recent orders with customer details
SELECT
    o.id,
    o.tracking_number,
    o.status,
    o.total_amount,
    o.order_date,
    u.first_name,
    u.last_name,
    u.email,
    a.city,
    a.postal_code
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN addresses a ON o.address_id = a.id
ORDER BY o.order_date DESC
LIMIT 10;

-- Get order details with items
SELECT
    oi.order_id,
    p.name as product_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    p.unit
FROM order_items oi
JOIN products p ON oi.product_id = p.id
ORDER BY oi.order_id, p.name;

-- Get delivery status
SELECT
    d.order_id,
    o.tracking_number,
    d.status as delivery_status,
    d.estimated_delivery,
    d.actual_delivery,
    d.current_lat,
    d.current_lng
FROM deliveries d
JOIN orders o ON d.order_id = o.id
ORDER BY d.estimated_delivery;

-- ===========================================
-- CLEANUP QUERIES (IF NEEDED)
-- ===========================================

-- To reset the database (CAUTION: This will delete all data)
/*
TRUNCATE deliveries, order_items, orders, inventory, products, addresses, users RESTART IDENTITY CASCADE;
*/

-- ===========================================
-- END OF SCRIPT
-- ===========================================

-- The database is now ready for the WoodShot application!
-- Admin user: admin@woodshot.com
-- Password: admin123 (hashed in the database)