-- Update script to fix product images in Neon database
-- Replace person image URLs with wood image URLs for affected products

UPDATE products
SET image_url = CASE
    WHEN wood_type = 'chêne' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png'
    WHEN wood_type = 'hêtre' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png'
    WHEN wood_type = 'bouleau' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png'
    WHEN wood_type = 'érable' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602425/woodshot/products/image%20copy%203.png'
    WHEN wood_type = 'pin' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602434/woodshot/products/image%20copy%205.png'
    WHEN wood_type = 'frêne' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602438/woodshot/products/image%20copy%202.png'
    WHEN wood_type = 'noyer' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602449/woodshot/products/imagefond.png'
    WHEN wood_type = 'sapin' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602455/woodshot/products/image%20copy%207.png'
    WHEN wood_type = 'tilleul' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602468/woodshot/products/image%20copy.png'
    WHEN wood_type = 'châtaignier' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602473/woodshot/products/image%20copy%206.png'
    WHEN wood_type = 'merisier' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602477/woodshot/products/image.png'
    WHEN wood_type = 'épicéa' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602455/woodshot/products/image%20copy%207.png'
    WHEN wood_type = 'aulne' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602473/woodshot/products/image%20copy%206.png'
    WHEN wood_type = 'orme' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602449/woodshot/products/imagefond.png'
    WHEN wood_type = 'mixte' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png'
    WHEN wood_type = 'chêne rouge' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png'
    WHEN wood_type = 'hêtre blanc' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png'
    WHEN wood_type = 'bouleau jaune' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602425/woodshot/products/image%20copy%203.png'
    WHEN wood_type = 'pin maritime' THEN 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602434/woodshot/products/image%20copy%205.png'
    ELSE image_url  -- Keep existing URL if wood_type doesn't match
END
WHERE image_url LIKE '%photospersonnes%' OR image_url IS NULL;