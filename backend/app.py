from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import Product, Inventory
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')
jwt = JWTManager(app)

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Create tables
Base.metadata.create_all(bind=engine)

# Admin PIN
ADMIN_PIN = os.getenv('ADMIN_PIN', '2017')

# Helper functions
def verify_admin_pin(pin):
    return pin == ADMIN_PIN

def upload_to_cloudinary(file):
    try:
        upload_result = cloudinary.uploader.upload(file, folder="woodshot/products")
        return upload_result['secure_url']
    except Exception as e:
        return None

# Routes

@app.route('/api/auth/admin', methods=['POST'])
def admin_access():
    data = request.get_json()
    if not verify_admin_pin(data.get('pin')):
        return jsonify({'message': 'Invalid PIN'}), 401

    # For simplicity, return a token or just confirm
    access_token = create_access_token(identity='admin')
    return jsonify({'access_token': access_token, 'is_admin': True})

@app.route('/api/products', methods=['GET'])
def get_products():
    db: Session = next(get_db())
    products = db.query(Product).filter_by(is_available=True).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'wood_type': p.wood_type,
        'price_per_unit': str(p.price_per_unit),
        'unit': p.unit,
        'stock_quantity': p.stock_quantity,
        'image_url': p.image_url,
        'specifications': p.specifications
    } for p in products])

@app.route('/api/products', methods=['POST'])
@jwt_required()
def create_product():
    current_user = get_jwt_identity()
    if current_user != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    data = request.form
    file = request.files.get('image')

    image_url = None
    if file:
        image_url = upload_to_cloudinary(file)

    db: Session = next(get_db())
    product = Product(
        name=data['name'],
        description=data.get('description'),
        wood_type=data['wood_type'],
        price_per_unit=data['price_per_unit'],
        unit=data['unit'],
        stock_quantity=data.get('stock_quantity', 0),
        image_url=image_url,
        specifications=data.get('specifications')
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return jsonify({'id': product.id, 'message': 'Product created'}), 201

@app.route('/api/products/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    current_user = get_jwt_identity()
    if current_user != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    data = request.form
    file = request.files.get('image')

    db: Session = next(get_db())
    product = db.query(Product).filter_by(id=id).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if file:
        product.image_url = upload_to_cloudinary(file)

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.wood_type = data.get('wood_type', product.wood_type)
    product.price_per_unit = data.get('price_per_unit', product.price_per_unit)
    product.unit = data.get('unit', product.unit)
    product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
    product.specifications = data.get('specifications', product.specifications)

    db.commit()
    return jsonify({'message': 'Product updated'})

@app.route('/api/products/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    current_user = get_jwt_identity()
    if current_user != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    db: Session = next(get_db())
    product = db.query(Product).filter_by(id=id).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    db.delete(product)
    db.commit()
    return jsonify({'message': 'Product deleted'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)