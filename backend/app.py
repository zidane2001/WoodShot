from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import Product, Inventory, User, Address, Order, OrderItem, Delivery, HeroImage, Settings
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from werkzeug.security import generate_password_hash, check_password_hash
import requests

load_dotenv()

app = Flask(__name__)

# ===== CONFIGURATION CORS SIMPLIFIÉE ET SÉCURISÉE =====
# Charger les origines autorisées depuis les variables d'environnement
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://woodshot-frontend.onrender.com'  # Votre URL de production
]

# Configuration CORS unique et propre
CORS(app, 
     resources={r"/api/*": {
         "origins": ALLOWED_ORIGINS,
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         "allow_headers": [
             "Content-Type",
             "Authorization",
             "X-Requested-With",
             "Accept",
             "Origin",
             "X-Admin-Request"
         ],
         "expose_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "max_age": 3600
     }},
     supports_credentials=True
)

# ===== HEADERS DE SÉCURITÉ =====
@app.after_request
def set_security_headers(response):
    """Ajoute uniquement les headers de sécurité nécessaires"""
    
    # Headers de sécurité (pas de headers CORS ici, Flask-CORS s'en occupe)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # En production, ajouter HTTPS strict
    if os.getenv('FLASK_ENV') == 'production':
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    return response

# NE PAS GÉRER OPTIONS MANUELLEMENT - Flask-CORS le fait automatiquement
# Supprimer tous les handlers OPTIONS manuels

# Configuration JWT
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # 24 heures
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

def upload_to_cloudinary(file, folder="woodshot/products"):
    try:
        upload_result = cloudinary.uploader.upload(file, folder=folder)
        return upload_result['secure_url']
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

# ===== ROUTES =====

# User Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        db: Session = next(get_db())

        # Check if user already exists
        if db.query(User).filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 400

        # Create user
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
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }), 201
    except Exception as e:
        print(f"Register error: {e}")
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        db: Session = next(get_db())

        user = db.query(User).filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        })
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/api/auth/admin', methods=['POST'])
def admin_access():
    try:
        data = request.get_json()
        if not verify_admin_pin(data.get('pin')):
            return jsonify({'message': 'Invalid PIN'}), 401

        access_token = create_access_token(identity='admin')
        return jsonify({'access_token': access_token, 'is_admin': True})
    except Exception as e:
        print(f"Admin auth error: {e}")
        return jsonify({'message': 'Admin authentication failed', 'error': str(e)}), 500
@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user = get_jwt_identity()

        if current_user == 'admin':
            return jsonify({
                'id': 'admin',
                'email': 'admin@woodshot.fr',
                'first_name': 'Admin',
                'last_name': 'WoodShot',
                'is_active': True,
                'is_admin': True,
            })

        # For regular users
        db: Session = next(get_db())
        user = db.query(User).filter_by(id=current_user).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'is_active': user.is_active,
            'is_admin': False,
        })
    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({'message': 'Failed to get user info', 'error': str(e)}), 500


@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        db: Session = next(get_db())
        products = db.query(Product).filter_by(is_available=True).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'wood_type': p.wood_type,
            'price_per_unit': float(p.price_per_unit),
            'unit': p.unit,
            'stock_quantity': p.stock_quantity,
            'image_url': p.image_url,
            'specifications': p.specifications
        } for p in products])
    except Exception as e:
        print(f"Get products error: {e}")
        return jsonify({'message': 'Failed to fetch products', 'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
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
    except Exception as e:
        print(f"Create product error: {e}")
        return jsonify({'message': 'Failed to create product', 'error': str(e)}), 500

@app.route('/api/products/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    try:
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
    except Exception as e:
        print(f"Update product error: {e}")
        return jsonify({'message': 'Failed to update product', 'error': str(e)}), 500

@app.route('/api/products/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    try:
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
    except Exception as e:
        print(f"Delete product error: {e}")
        return jsonify({'message': 'Failed to delete product', 'error': str(e)}), 500

# Address Management Routes
@app.route('/api/addresses', methods=['GET'])
@jwt_required()
def get_addresses():
    try:
        current_user = get_jwt_identity()
        if current_user == 'admin':
            return jsonify({'message': 'Admin cannot access user addresses'}), 403

        db: Session = next(get_db())
        addresses = db.query(Address).filter_by(user_id=current_user).all()
        return jsonify([{
            'id': addr.id,
            'street': addr.street,
            'city': addr.city,
            'postal_code': addr.postal_code,
            'country': addr.country,
            'is_default': addr.is_default
        } for addr in addresses])
    except Exception as e:
        print(f"Get addresses error: {e}")
        return jsonify({'message': 'Failed to fetch addresses', 'error': str(e)}), 500

@app.route('/api/addresses', methods=['POST'])
@jwt_required()
def create_address():
    try:
        current_user = get_jwt_identity()
        if current_user == 'admin':
            return jsonify({'message': 'Admin cannot create user addresses'}), 403

        data = request.get_json()
        db: Session = next(get_db())

        address = Address(
            user_id=current_user,
            street=data['street'],
            city=data['city'],
            postal_code=data['postal_code'],
            country=data.get('country', 'France'),
            is_default=data.get('is_default', False)
        )
        db.add(address)
        db.commit()
        db.refresh(address)
        return jsonify({'id': address.id, 'message': 'Address created'}), 201
    except Exception as e:
        print(f"Create address error: {e}")
        return jsonify({'message': 'Failed to create address', 'error': str(e)}), 500

@app.route('/api/addresses/<int:id>', methods=['PUT'])
@jwt_required()
def update_address(id):
    try:
        current_user = get_jwt_identity()
        if current_user == 'admin':
            return jsonify({'message': 'Admin cannot update user addresses'}), 403

        data = request.get_json()
        db: Session = next(get_db())
        address = db.query(Address).filter_by(id=id, user_id=current_user).first()
        if not address:
            return jsonify({'message': 'Address not found'}), 404

        address.street = data.get('street', address.street)
        address.city = data.get('city', address.city)
        address.postal_code = data.get('postal_code', address.postal_code)
        address.country = data.get('country', address.country)
        address.is_default = data.get('is_default', address.is_default)

        db.commit()
        return jsonify({'message': 'Address updated'})
    except Exception as e:
        print(f"Update address error: {e}")
        return jsonify({'message': 'Failed to update address', 'error': str(e)}), 500

@app.route('/api/addresses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_address(id):
    try:
        current_user = get_jwt_identity()
        if current_user == 'admin':
            return jsonify({'message': 'Admin cannot delete user addresses'}), 403

        db: Session = next(get_db())
        address = db.query(Address).filter_by(id=id, user_id=current_user).first()
        if not address:
            return jsonify({'message': 'Address not found'}), 404

        db.delete(address)
        db.commit()
        return jsonify({'message': 'Address deleted'})
    except Exception as e:
        print(f"Delete address error: {e}")
        return jsonify({'message': 'Failed to delete address', 'error': str(e)}), 500

# Order Management Routes
@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        current_user = get_jwt_identity()
        db: Session = next(get_db())

        if current_user == 'admin':
            orders = db.query(Order).all()
        else:
            orders = db.query(Order).filter_by(user_id=current_user).all()

        return jsonify([{
            'id': order.id,
            'total_amount': float(order.total_amount),
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'user_id': order.user_id
        } for order in orders])
    except Exception as e:
        print(f"Get orders error: {e}")
        return jsonify({'message': 'Failed to fetch orders', 'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        current_user = get_jwt_identity()
        if current_user == 'admin':
            return jsonify({'message': 'Admin cannot create orders'}), 403

        data = request.get_json()
        db: Session = next(get_db())

        # Calculate total amount and create order items
        total_amount = 0
        order_items = []

        for item_data in data['items']:
            product = db.query(Product).filter_by(id=item_data['product_id']).first()
            if not product:
                return jsonify({'message': f'Product {item_data["product_id"]} not found'}), 404

            quantity = item_data['quantity']
            unit_price = float(product.price_per_unit)
            total_price = unit_price * quantity
            total_amount += total_price

            order_item = OrderItem(
                product_id=product.id,
                quantity=quantity,
                unit_price=unit_price,
                total_price=total_price
            )
            order_items.append(order_item)

        # Create order
        order = Order(
            user_id=current_user,
            total_amount=total_amount,
            status='pending'
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        # Add order items
        for item in order_items:
            item.order_id = order.id
            db.add(item)

        db.commit()
        return jsonify({'id': order.id, 'message': 'Order created', 'total_amount': float(total_amount)}), 201
    except Exception as e:
        print(f"Create order error: {e}")
        return jsonify({'message': 'Failed to create order', 'error': str(e)}), 500

@app.route('/api/orders/<int:id>', methods=['PUT'])
@jwt_required()
def update_order_status(id):
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        db: Session = next(get_db())

        order = db.query(Order).filter_by(id=id).first()
        if not order:
            return jsonify({'message': 'Order not found'}), 404

        # Only admin or order owner can update
        if current_user != 'admin' and order.user_id != current_user:
            return jsonify({'message': 'Access denied'}), 403

        order.status = data.get('status', order.status)
        db.commit()
        return jsonify({'message': 'Order updated'})
    except Exception as e:
        print(f"Update order error: {e}")
        return jsonify({'message': 'Failed to update order', 'error': str(e)}), 500

# Delivery Management Routes
@app.route('/api/deliveries', methods=['GET'])
@jwt_required()
def get_deliveries():
    try:
        current_user = get_jwt_identity()
        db: Session = next(get_db())

        if current_user == 'admin':
            deliveries = db.query(Delivery).all()
        else:
            deliveries = db.query(Delivery).join(Order).filter(Order.user_id == current_user).all()

        return jsonify([{
            'id': delivery.id,
            'order_id': delivery.order_id,
            'address': {
                'street': delivery.address.street,
                'city': delivery.address.city,
                'postal_code': delivery.address.postal_code,
                'country': delivery.address.country
            },
            'delivery_date': delivery.delivery_date.isoformat() if delivery.delivery_date else None,
            'status': delivery.status,
            'tracking_number': delivery.tracking_number,
            'notes': delivery.notes
        } for delivery in deliveries])
    except Exception as e:
        print(f"Get deliveries error: {e}")
        return jsonify({'message': 'Failed to fetch deliveries', 'error': str(e)}), 500

@app.route('/api/deliveries', methods=['POST'])
@jwt_required()
def create_delivery():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        data = request.get_json()
        db: Session = next(get_db())

        delivery = Delivery(
            order_id=data['order_id'],
            address_id=data['address_id'],
            delivery_date=data.get('delivery_date'),
            status=data.get('status', 'pending'),
            tracking_number=data.get('tracking_number'),
            notes=data.get('notes')
        )
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        return jsonify({'id': delivery.id, 'message': 'Delivery created'}), 201
    except Exception as e:
        print(f"Create delivery error: {e}")
        return jsonify({'message': 'Failed to create delivery', 'error': str(e)}), 500

@app.route('/api/deliveries/<int:id>', methods=['PUT'])
@jwt_required()
def update_delivery(id):
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        data = request.get_json()
        db: Session = next(get_db())
        delivery = db.query(Delivery).filter_by(id=id).first()
        if not delivery:
            return jsonify({'message': 'Delivery not found'}), 404

        delivery.delivery_date = data.get('delivery_date', delivery.delivery_date)
        delivery.status = data.get('status', delivery.status)
        delivery.tracking_number = data.get('tracking_number', delivery.tracking_number)
        delivery.notes = data.get('notes', delivery.notes)

        db.commit()
        return jsonify({'message': 'Delivery updated'})
    except Exception as e:
        print(f"Update delivery error: {e}")
        return jsonify({'message': 'Failed to update delivery', 'error': str(e)}), 500

# Admin Routes for Users, Orders, Deliveries
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        db: Session = next(get_db())
        users = db.query(User).all()
        return jsonify([{
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat()
        } for user in users])
    except Exception as e:
        print(f"Get all users error: {e}")
        return jsonify({'message': 'Failed to fetch users', 'error': str(e)}), 500

@app.route('/api/admin/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        db: Session = next(get_db())
        orders = db.query(Order).all()
        return jsonify([{
            'id': order.id,
            'user': {
                'id': order.user.id,
                'email': order.user.email,
                'first_name': order.user.first_name,
                'last_name': order.user.last_name
            },
            'total_amount': float(order.total_amount),
            'status': order.status,
            'created_at': order.created_at.isoformat()
        } for order in orders])
    except Exception as e:
        print(f"Get all orders error: {e}")
        return jsonify({'message': 'Failed to fetch orders', 'error': str(e)}), 500

@app.route('/api/admin/deliveries', methods=['GET'])
@jwt_required()
def get_all_deliveries():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        db: Session = next(get_db())
        deliveries = db.query(Delivery).all()
        return jsonify([{
            'id': delivery.id,
            'order_id': delivery.order_id,
            'user': {
                'id': delivery.order.user.id,
                'email': delivery.order.user.email
            },
            'address': {
                'street': delivery.address.street,
                'city': delivery.address.city,
                'postal_code': delivery.address.postal_code
            },
            'delivery_date': delivery.delivery_date.isoformat() if delivery.delivery_date else None,
            'status': delivery.status,
            'tracking_number': delivery.tracking_number
        } for delivery in deliveries])
    except Exception as e:
        print(f"Get all deliveries error: {e}")
        return jsonify({'message': 'Failed to fetch deliveries', 'error': str(e)}), 500

# Admin Dashboard Stats
@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        db: Session = next(get_db())

        total_products = db.query(Product).count()
        total_orders = db.query(Order).count()
        total_users = db.query(User).count()
        low_stock_products = db.query(Product).filter(Product.stock_quantity < 10).count()

        return jsonify({
            'total_products': total_products,
            'total_orders': total_orders,
            'total_users': total_users,
            'low_stock_products': low_stock_products
        })
    except Exception as e:
        print(f"Get dashboard stats error: {e}")
        return jsonify({'message': 'Failed to fetch dashboard stats', 'error': str(e)}), 500

# Hero Images Routes
@app.route('/api/hero-images', methods=['GET'])
def get_hero_images():
    try:
        db: Session = next(get_db())
        hero_images = db.query(HeroImage).filter_by(is_active=True).order_by(HeroImage.display_order).all()
        return jsonify([{
            'id': img.id,
            'title': img.title,
            'description': img.description,
            'image_url': img.image_url,
            'display_order': img.display_order
        } for img in hero_images])
    except Exception as e:
        print(f"Get hero images error: {e}")
        return jsonify({'message': 'Failed to fetch hero images', 'error': str(e)}), 500

@app.route('/api/hero-images', methods=['POST'])
@jwt_required()
def create_hero_image():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        data = request.form
        file = request.files.get('image')

        image_url = None
        if file:
            image_url = upload_to_cloudinary(file, folder="woodshot/hero")

        db: Session = next(get_db())
        hero_image = HeroImage(
            title=data['title'],
            description=data.get('description'),
            image_url=image_url,
            display_order=data.get('display_order', 0)
        )
        db.add(hero_image)
        db.commit()
        db.refresh(hero_image)
        return jsonify({'id': hero_image.id, 'message': 'Hero image created'}), 201
    except Exception as e:
        print(f"Create hero image error: {e}")
        return jsonify({'message': 'Failed to create hero image', 'error': str(e)}), 500

@app.route('/api/hero-images/<int:id>', methods=['PUT'])
@jwt_required()
def update_hero_image(id):
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        data = request.form
        file = request.files.get('image')

        db: Session = next(get_db())
        hero_image = db.query(HeroImage).filter_by(id=id).first()
        if not hero_image:
            return jsonify({'message': 'Hero image not found'}), 404

        if file:
            hero_image.image_url = upload_to_cloudinary(file, folder="woodshot/hero")

        hero_image.title = data.get('title', hero_image.title)
        hero_image.description = data.get('description', hero_image.description)
        hero_image.display_order = data.get('display_order', hero_image.display_order)
        hero_image.is_active = data.get('is_active', hero_image.is_active)

        db.commit()
        return jsonify({'message': 'Hero image updated'})
    except Exception as e:
        print(f"Update hero image error: {e}")
        return jsonify({'message': 'Failed to update hero image', 'error': str(e)}), 500

@app.route('/api/hero-images/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_hero_image(id):
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        db: Session = next(get_db())
        hero_image = db.query(HeroImage).filter_by(id=id).first()
        if not hero_image:
            return jsonify({'message': 'Hero image not found'}), 404

        db.delete(hero_image)
        db.commit()
        return jsonify({'message': 'Hero image deleted'})
    except Exception as e:
        print(f"Delete hero image error: {e}")
        return jsonify({'message': 'Failed to delete hero image', 'error': str(e)}), 500

# Settings Routes
@app.route('/api/admin/settings', methods=['GET'])
@jwt_required()
def get_settings():
    try:
        current_user = get_jwt_identity()
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        db: Session = next(get_db())
        settings = db.query(Settings).all()
        return jsonify({setting.key: setting.value for setting in settings})
    except Exception as e:
        print(f"Get settings error: {e}")
        return jsonify({'message': 'Failed to fetch settings', 'error': str(e)}), 500

@app.route('/api/admin/settings', methods=['POST'])
@jwt_required()
def update_settings():
    db: Session = next(get_db())
    try:
        current_user = get_jwt_identity()
        print(f"Update settings - current_user: {current_user}")
        if current_user != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        data = request.get_json()
        print(f"Update settings - data: {data}")

        for key, value in data.items():
            print(f"Updating setting: {key} = {value}")
            setting = db.query(Settings).filter_by(key=key).first()
            if setting:
                setting.value = str(value)
                print(f"Updated existing setting: {key}")
            else:
                setting = Settings(key=key, value=str(value), description=f"Setting for {key}")
                db.add(setting)
                print(f"Created new setting: {key}")

        db.commit()
        print("Settings committed successfully")
        return jsonify({'message': 'Settings updated successfully'})
    except Exception as e:
        print(f"Update settings error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Failed to update settings', 'error': str(e)}), 500
    finally:
        db.close()

# Public Settings Routes
@app.route('/api/settings/iban', methods=['GET'])
def get_iban():
    try:
        db: Session = next(get_db())
        iban_setting = db.query(Settings).filter_by(key='iban').first()
        if iban_setting and iban_setting.value:
            return jsonify({'iban': iban_setting.value})
        else:
            return jsonify({'iban': 'IBAN non configuré'}), 200
    except Exception as e:
        print(f"Get IBAN error: {e}")
        return jsonify({'error': 'Failed to fetch IBAN', 'detail': str(e)}), 500

# Payment Routes
@app.route('/api/payments/create', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        print(f"Payment request received: {data}")

        payment_method = data.get('payment_method', 'bank')

        if payment_method == 'crypto':
            return create_crypto_payment(data)
        elif payment_method == 'bank':
            return create_bank_payment(data)
        else:
            return jsonify({'error': 'Unsupported payment method'}), 400

    except Exception as e:
        print(f"Payment error: {e}")
        return jsonify({'error': 'Payment creation failed', 'detail': str(e)}), 500

def create_bank_payment(data):
    """Handle bank transfer payments"""
    try:
        # Get IBAN from settings
        db: Session = next(get_db())
        iban_setting = db.query(Settings).filter_by(key='iban').first()

        if not iban_setting or not iban_setting.value:
            return jsonify({'error': 'Bank transfer not configured', 'detail': 'IBAN not set'}), 500

        iban = iban_setting.value

        # Create bank transfer instructions
        success_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/payment/success"

        return jsonify({
            'payment_url': success_url,
            'payment_id': f'bank_{data.get("order_id")}',
            'order_id': data.get('order_id'),
            'status': 'pending',
            'payment_method': 'bank',
            'iban': iban,
            'amount': data.get('amount', 0),
            'instructions': f'Veuillez effectuer un virement bancaire de {data.get("amount", 0)}€ vers le compte IBAN: {iban}. Mentionnez la référence commande: {data.get("order_id")} dans la description du virement.'
        }), 200

    except Exception as e:
        print(f"Bank payment error: {e}")
        return jsonify({'error': 'Bank payment setup failed', 'detail': str(e)}), 500

@app.route('/api/payments/callback', methods=['POST'])
def payment_callback():
    try:
        data = request.get_json()
        print(f"Payment callback received: {data}")

        # Handle payment status updates
        payment_status = data.get('payment_status')
        order_id = data.get('order_id')

        if payment_status == 'finished':
            print(f"Payment successful for order {order_id}")
        elif payment_status == 'failed':
            print(f"Payment failed for order {order_id}")

        return jsonify({'status': 'ok'}), 200

    except Exception as e:
        print(f"Callback error: {e}")
        return jsonify({'error': 'Callback processing failed'}), 500


if __name__ == '__main__':
    # Configuration selon l'environnement
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=8000)