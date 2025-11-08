from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import User, Product, Order, OrderItem, Address, Delivery, Inventory
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from datetime import datetime
import uuid

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
ADMIN_PIN = os.getenv('ADMIN_PIN', '1234')

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

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    db: Session = next(get_db())

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(data['password'])
    user = User(
        email=data['email'],
        password_hash=hashed_password,
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone=data.get('phone')
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'email': user.email, 'is_admin': user.is_admin}}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    db: Session = next(get_db())

    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'email': user.email, 'is_admin': user.is_admin}})

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

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    current_user = get_jwt_identity()
    if isinstance(current_user, str) and current_user == 'admin':
        return jsonify({'message': 'Admin cannot create orders'}), 403

    data = request.get_json()
    db: Session = next(get_db())

    # Create address if not exists
    address = Address(
        user_id=current_user,
        street=data['address']['street'],
        city=data['address']['city'],
        postal_code=data['address']['postal_code'],
        country=data['address']['country']
    )
    db.add(address)
    db.commit()
    db.refresh(address)

    # Calculate total
    total = 0
    order_items = []
    for item in data['items']:
        product = db.query(Product).filter_by(id=item['product_id']).first()
        if not product or product.stock_quantity < item['quantity']:
            return jsonify({'message': f'Insufficient stock for {product.name}'}), 400
        unit_price = product.price_per_unit
        total += unit_price * item['quantity']
        order_items.append({
            'product_id': item['product_id'],
            'quantity': item['quantity'],
            'unit_price': unit_price,
            'total_price': unit_price * item['quantity']
        })

    # Create order
    order = Order(
        user_id=current_user,
        address_id=address.id,
        total_amount=total,
        tracking_number=str(uuid.uuid4())
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Create order items
    for item in order_items:
        order_item = OrderItem(
            order_id=order.id,
            **item
        )
        db.add(order_item)
        # Update stock
        product = db.query(Product).filter_by(id=item['product_id']).first()
        product.stock_quantity -= item['quantity']

    db.commit()
    return jsonify({'order_id': order.id, 'tracking_number': order.tracking_number, 'message': 'Order created'}), 201

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()
    db: Session = next(get_db())

    if isinstance(current_user, str) and current_user == 'admin':
        orders = db.query(Order).all()
    else:
        orders = db.query(Order).filter_by(user_id=current_user).all()

    return jsonify([{
        'id': o.id,
        'status': o.status,
        'total_amount': str(o.total_amount),
        'order_date': o.order_date.isoformat(),
        'tracking_number': o.tracking_number
    } for o in orders])

@app.route('/api/orders/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    current_user = get_jwt_identity()
    db: Session = next(get_db())

    order = db.query(Order).filter_by(id=id).first()
    if not order or (not isinstance(current_user, str) and order.user_id != current_user and current_user != 'admin'):
        return jsonify({'message': 'Order not found'}), 404

    items = db.query(OrderItem).filter_by(order_id=id).all()
    return jsonify({
        'id': order.id,
        'status': order.status,
        'total_amount': str(order.total_amount),
        'order_date': order.order_date.isoformat(),
        'items': [{
            'product_id': i.product_id,
            'quantity': i.quantity,
            'unit_price': str(i.unit_price),
            'total_price': str(i.total_price)
        } for i in items]
    })

@app.route('/api/delivery/<tracking_number>', methods=['GET'])
def get_delivery_status(tracking_number):
    db: Session = next(get_db())
    order = db.query(Order).filter_by(tracking_number=tracking_number).first()
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    delivery = db.query(Delivery).filter_by(order_id=order.id).first()
    if not delivery:
        return jsonify({'status': order.status, 'message': 'Delivery not started'})

    return jsonify({
        'status': delivery.status,
        'current_lat': delivery.current_lat,
        'current_lng': delivery.current_lng,
        'route_coordinates': delivery.route_coordinates
    })

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    if current_user != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    db: Session = next(get_db())
    users = db.query(User).all()
    return jsonify([{
        'id': u.id,
        'email': u.email,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'phone': u.phone,
        'is_active': u.is_active
    } for u in users])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)