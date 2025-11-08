-- Simplified SQL Schema for Neon (PostgreSQL)
-- Tables: products and inventory
-- Includes sample data for 19 wood products with Cloudinary URLs

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    wood_type VARCHAR NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit VARCHAR NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR,
    specifications JSONB,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data for 19 wood products
INSERT INTO products (name, description, wood_type, price_per_unit, unit, stock_quantity, image_url, specifications, is_available) VALUES
('Bois de chauffage Chêne', 'Bois de chauffage en chêne de qualité supérieure', 'chêne', 150.00, 'stère', 50, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png', '{"humidite": "20%", "densite": "0.7"}', true),
('Bois de chauffage Bouleau', 'Bois de chauffage en bouleau sec', 'bouleau', 140.00, 'stère', 40, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png', '{"humidite": "18%", "densite": "0.6"}', true),
('Bois de chauffage Hêtre', 'Bois de chauffage en hêtre durable', 'hêtre', 160.00, 'stère', 30, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png', '{"humidite": "22%", "densite": "0.8"}', true),
('Bois de chauffage Érable', 'Bois de chauffage en érable', 'érable', 155.00, 'stère', 25, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602425/woodshot/products/image%20copy%203.png', '{"humidite": "19%", "densite": "0.65"}', true),
('Bois de chauffage Pin', 'Bois de chauffage en pin', 'pin', 130.00, 'stère', 60, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602434/woodshot/products/image%20copy%205.png', '{"humidite": "15%", "densite": "0.5"}', true),
('Bois de chauffage Sapin', 'Bois de chauffage en sapin', 'sapin', 135.00, 'stère', 45, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602438/woodshot/products/image%20copy%202.png', '{"humidite": "16%", "densite": "0.55"}', true),
('Bois de chauffage Frêne', 'Bois de chauffage en frêne', 'frêne', 165.00, 'stère', 20, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602449/woodshot/products/imagefond.png', '{"humidite": "21%", "densite": "0.75"}', true),
('Bois de chauffage Noyer', 'Bois de chauffage en noyer', 'noyer', 180.00, 'stère', 15, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602455/woodshot/products/image%20copy%207.png', '{"humidite": "23%", "densite": "0.8"}', true),
('Bois de chauffage Tilleul', 'Bois de chauffage en tilleul', 'tilleul', 145.00, 'stère', 35, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602468/woodshot/products/image%20copy.png', '{"humidite": "17%", "densite": "0.6"}', true),
('Bois de chauffage Peuplier', 'Bois de chauffage en peuplier', 'peuplier', 125.00, 'stère', 70, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602473/woodshot/products/image%20copy%206.png', '{"humidite": "14%", "densite": "0.45"}', true),
('Bois de chauffage Orme', 'Bois de chauffage en orme', 'orme', 170.00, 'stère', 10, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602477/woodshot/products/image.png', '{"humidite": "24%", "densite": "0.85"}', true),
('Bois de chauffage Charme', 'Bois de chauffage en charme', 'charme', 158.00, 'stère', 28, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png', '{"humidite": "20%", "densite": "0.7"}', true),
('Bois de chauffage Aulne', 'Bois de chauffage en aulne', 'aulne', 138.00, 'stère', 42, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png', '{"humidite": "18%", "densite": "0.6"}', true),
('Bois de chauffage Merisier', 'Bois de chauffage en merisier', 'merisier', 175.00, 'stère', 18, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png', '{"humidite": "22%", "densite": "0.8"}', true),
('Bois de chauffage Acajou', 'Bois de chauffage en acajou', 'acajou', 190.00, 'stère', 12, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602425/woodshot/products/image%20copy%203.png', '{"humidite": "25%", "densite": "0.9"}', true),
('Bois de chauffage Ébène', 'Bois de chauffage en ébène', 'ébène', 200.00, 'stère', 8, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602434/woodshot/products/image%20copy%205.png', '{"humidite": "26%", "densite": "1.0"}', true),
('Bois de chauffage Cèdre', 'Bois de chauffage en cèdre', 'cèdre', 148.00, 'stère', 38, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602438/woodshot/products/image%20copy%202.png', '{"humidite": "16%", "densite": "0.55"}', true),
('Bois de chauffage Séquoia', 'Bois de chauffage en séquoia', 'séquoia', 185.00, 'stère', 14, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602449/woodshot/products/imagefond.png', '{"humidite": "21%", "densite": "0.75"}', true),
('Bois de chauffage Cyprès', 'Bois de chauffage en cyprès', 'cyprès', 152.00, 'stère', 32, 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602455/woodshot/products/image%20copy%207.png', '{"humidite": "19%", "densite": "0.65"}', true);

-- Sample data for inventory (one per product)
INSERT INTO inventory (product_id, quantity, reserved_quantity) VALUES
(1, 50, 0),
(2, 40, 0),
(3, 30, 0),
(4, 25, 0),
(5, 60, 0),
(6, 45, 0),
(7, 20, 0),
(8, 15, 0),
(9, 35, 0),
(10, 70, 0),
(11, 10, 0),
(12, 28, 0),
(13, 42, 0),
(14, 18, 0),
(15, 12, 0),
(16, 8, 0),
(17, 38, 0),
(18, 14, 0),
(19, 32, 0);