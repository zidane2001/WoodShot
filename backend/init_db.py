from database import engine, Base
from models import User, Product, Order, OrderItem, Address, Delivery, Inventory
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

def init_database():
    """Initialize the database and create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def seed_database():
    """Seed the database with initial data"""
    from werkzeug.security import generate_password_hash
    from sqlalchemy.orm import Session

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Check if admin user exists
        admin_user = db.query(User).filter_by(email='admin@woodshot.com').first()
        if not admin_user:
            admin = User(
                email='admin@woodshot.com',
                password_hash=generate_password_hash('admin123'),
                first_name='Admin',
                last_name='WoodShot',
                is_admin=True
            )
            db.add(admin)
            print("Admin user created: admin@woodshot.com / admin123")

        # Check if products exist
        if db.query(Product).count() == 0:
            products_data = [
                {
                    'name': 'Chêne Premium',
                    'description': 'High-quality oak wood for heating',
                    'wood_type': 'chêne',
                    'price_per_unit': 150.00,
                    'unit': 'stère',
                    'stock_quantity': 100,
                    'image_url': 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602484/woodshot/products/boisChauffageCh%C3%AAne.png',
                    'specifications': {'humidity': '15%', 'density': '0.7 g/cm³'}
                },
                {
                    'name': 'Hêtre Naturel',
                    'description': 'Natural beech wood',
                    'wood_type': 'hêtre',
                    'price_per_unit': 120.00,
                    'unit': 'stère',
                    'stock_quantity': 80,
                    'image_url': 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602427/woodshot/products/boisChauffageBouleau.png',
                    'specifications': {'humidity': '12%', 'density': '0.65 g/cm³'}
                },
                {
                    'name': 'Bouleau Blanc',
                    'description': 'White birch wood',
                    'wood_type': 'bouleau',
                    'price_per_unit': 110.00,
                    'unit': 'stère',
                    'stock_quantity': 60,
                    'image_url': 'https://res.cloudinary.com/djxiszqgd/image/upload/v1762602461/woodshot/products/boisChauffageBou.png',
                    'specifications': {'humidity': '10%', 'density': '0.6 g/cm³'}
                }
            ]

            for product_data in products_data:
                product = Product(**product_data)
                db.add(product)
                # Create inventory entry
                inventory = Inventory(product=product, quantity=product_data['stock_quantity'])
                db.add(inventory)

            print("Sample products and inventory created!")

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
    seed_database()